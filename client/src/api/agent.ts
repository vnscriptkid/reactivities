import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/Activity';

function sleep (delay: number) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const getResponseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(getResponseBody),
    post: (url: string, body = {}) => axios.post(url, body).then(getResponseBody),
    put: (url: string, body = {}) => axios.put(url, body).then(getResponseBody),
    delete: (url: string) => axios.delete(url).then(getResponseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities')
}

const agent = {
    Activities
}

export default agent;