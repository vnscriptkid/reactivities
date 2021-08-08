import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/User";

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
            console.log({ ...user });
            runInAction(() => {
                this.user = user;
            })
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}