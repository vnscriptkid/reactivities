import { makeAutoObservable } from "mobx";

export default class CommonStore {
    token: string | null = null;
    appLoaded = false;
    
    constructor() {
        makeAutoObservable(this);
    }

    setToken = (token : string | null) => {
        if (token) localStorage.setItem('jwt', token);
        else localStorage.removeItem('jwt');
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}