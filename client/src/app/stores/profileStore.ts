import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Profile } from "../models/Profile";
import { store } from "./store";

export default class ProfilesStore {
    profile: Profile | null = null;
    loading = false;
    uploading = false;

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

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                this.profile?.photos?.push(photo);
                if (photo.isMain) store.userStore.setImage(photo.url);
            })
        } catch (e) {
            console.error(e);
        } finally {
            runInAction(() => this.uploading = false);
        }
    }
}