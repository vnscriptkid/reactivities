import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile, UserActivity } from "../models/Profile";
import { store } from "./store";

export default class ProfilesStore {
    profile: Profile | null = null;
    loading = false;
    uploading = false;
    initialLoading = false;
    followings: Profile[] = []; // either followings or followers
    followersLoading = false;
    activeTab = 0;
    userActivities: UserActivity[] = [];
    loadingActivities = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.getFollowingsOrFollowers(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;   
    }

    setActiveTab = (tab: any) => {
        this.activeTab = tab;
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

    toggleFollowing = async (username: string, following: boolean) => {
        this.loading = true;

        try {
            await agent.Profiles.toggleFollowing(username);
            
            store.activityStore.updateAttendeeFollowing(username, following);
            
            runInAction(() => {

                if (this.profile?.username !== store.userStore.user?.username) {
                    if (this.profile?.username === username) {
                        this.profile.following = following;
                        following ? this.profile.followersCount++ : this.profile.followersCount--;
                    }
                }

                this.followings.forEach(profile => {
                    if (profile.username === store.userStore.user?.username) {
                        following ? profile.followersCount++ : profile.followersCount--;
                    }

                    if (profile.username === username) {
                        profile.following = following;
                        following ? profile.followersCount++ : profile.followersCount--;
                    }
                });
            })
        } catch (err) {
            console.log(err);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    getFollowingsOrFollowers = async (predicate: "following" | "followers") => {
        if (!this.profile) return;

        this.followersLoading = true;

        try {
            const profiles = await agent.Profiles.getFollowingsOrFollowers(this.profile.username, predicate);
            
            runInAction(() => {
                switch (predicate) {
                    case "followers":
                        this.followings = profiles;
                        break;
                    case "following":
                        this.followings = profiles;
                        break;
                }
            })
        } catch (err) {
            console.log(err);
        } finally {
            runInAction(() => this.followersLoading = false)
        }
    }

    loadUserActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true;

        try {
            const userActivities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() => this.userActivities = userActivities);
        } catch (err) {
            console.error(err);
        } finally {
            runInAction(() => this.loadingActivities = false);
        }
    }
}