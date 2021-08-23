import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/User";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;
    fbAccessToken: string | null = null;
    fbLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (values: UserFormValues) => {
        try {
            const user = await agent.Account.login(values);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            history.push('/activities');
            store.modalStore.closeModal();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    fbLogin = async () => {
        if (!window.FB) return;

        this.fbLoading = true;

        const loginWithFbToken = (accessToken: string) => {
            agent.Account.fbLogin(accessToken).then(user => {
                store.commonStore.setToken(user.token);
                runInAction(() => this.user = user);
                history.push('/activities');
            }).catch(err => {
                console.error(err);
                throw err;
            }).finally(() => {
                this.fbLoading = false;
            })
        }

        if (this.fbAccessToken) {
            // https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/
            // The user is logged into Facebook and has authorized your application
            loginWithFbToken(this.fbAccessToken);
        } else {
            window.FB.login(response => {
                loginWithFbToken(response.authResponse.accessToken);
            }, {scope: 'public_profile,email'});
        }
    }

    getFbLoginStatus = async () => {
        window.FB && window.FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                this.fbAccessToken = response.authResponse.accessToken;
            }
        });
    }

    register = async (values: UserFormValues) => {
        try {
            const user = await agent.Account.register(values);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            history.push('/activities');
            store.modalStore.closeModal();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch (e) {
            console.error(e);
        }
    }

    setImage = (image: string) => {
        if (this.user) this.user.image = image; 
    }
}