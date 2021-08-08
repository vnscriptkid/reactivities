import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/Activity';
import { User, UserFormValues } from '../models/User';

function sleep (delay: number) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    try {
        await sleep(500);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const getResponseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(getResponseBody),
    post: <T> (url: string, body = {}) => axios.post<T>(url, body).then(getResponseBody),
    put: <T> (url: string, body = {}) => axios.put<T>(url, body).then(getResponseBody),
    delete: <T> (url: string) => axios.delete(url).then<T>(getResponseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>(`/activities`, activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (values: UserFormValues) => requests.post<User>('/login', values),
    register: (values: UserFormValues) => requests.post<User>('/register', values),
}

const agent = {
    Activities,
    Account
}

export default agent;