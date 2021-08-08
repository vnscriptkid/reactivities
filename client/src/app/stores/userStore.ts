import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/User";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;

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
}