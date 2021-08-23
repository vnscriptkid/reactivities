import axios, { AxiosResponse } from 'axios';
import { Activity, ActivityFormValues } from '../models/Activity';
import { PaginatedResult } from '../models/Pagination';
import { Photo, Profile, UserActivity } from '../models/Profile';
import { User, UserFormValues } from '../models/User';
import { store } from '../stores/store';

function sleep (delay: number) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(async response => {
    try {
        if (process.env.NODE_ENV === 'development') await sleep(500);
        const pagination = response.headers['pagination'];
        if (pagination) {
            response.data = new PaginatedResult(response.data, JSON.parse(pagination));
            return response as AxiosResponse<PaginatedResult<any>>;
        }
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const getResponseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(getResponseBody),
    post: <T> (url: string, body = {}) => axios.post<T>(url, body).then(getResponseBody),
    put: <T> (url: string, body = {}) => axios.put<T>(url, body).then(getResponseBody),
    delete: <T> (url: string) => axios.delete(url).then<T>(getResponseBody),
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params}).then(getResponseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>(`/activities`, activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`)
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (values: UserFormValues) => requests.post<User>('/account/login', values),
    register: (values: UserFormValues) => requests.post<User>('/account/register', values),
    fbLogin: (accessToken: string) => requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {})
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();   
        formData.append('File', file);
        return axios.post<Photo>('/photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        });
    },
    setMain: (photoId: string) => requests.post(`/photos/${photoId}/setmain`),
    deletePhoto: (photoId: string) => requests.delete(`/photos/${photoId}`),
    toggleFollowing: (username: string) => requests.post(`/follow/${username}`),
    getFollowingsOrFollowers: (username: string, predicate: "following" | "followers") => 
        requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => 
        requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;