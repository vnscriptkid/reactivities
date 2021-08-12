import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/Profile";
import { store } from "./store";

export default class ProfilesStore {
    profile: Profile | null = null;
    loading = false;
    uploading = false;
    initialLoading = false;

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
        this.initialLoading = true;

        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => this.profile = profile);
        } catch (e) {
            console.error(e);
        } finally {
            runInAction(() => this.initialLoading = false);
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

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;

        try {
            await agent.Profiles.setMain(photo.id);

            runInAction(() => {
                if (this.profile && this.profile.photos && store.userStore.user) {
                    store.userStore.setImage(photo.url);
                    this.profile.image = photo.url;
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                }
            });
        } catch (e) {
            console.error(e);
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;

        try {
            await agent.Profiles.deletePhoto(photo.id);
            
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
                }
            })
        } catch (e) {
            console.error(e);
        } finally {
            runInAction(() => this.loading = false)
        }
    }
}