import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Profile } from "../models/Profile";
import { store } from "./store";

export default class ProfilesStore {
    profile: Profile | null = null;
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;   
    }

    loadProfile = async (username: string) => {
        this.loading = true;

        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => this.profile = profile);
        } catch (e) {
            console.error(e);
        } finally {
            runInAction(() => this.loading = false);
        }
    }
}