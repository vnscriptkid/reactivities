import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/Activity";
import { Profile } from "../models/Profile";
import { store } from "./store";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    initialLoading = false;
    selectedActivity: Activity | undefined = undefined;
    loading = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate () {
        return Array.from(this.activityRegistry.values())
                .sort((a, b) => b.date!.getTime() - a.date!.getTime());
    }

    get groupedActivites () {
        const grouped: {[key: string]: Activity[]} = {};

        Array.from(this.activityRegistry.values()).forEach(activity => {
            const date = format(activity.date!, 'dd MMM yyyy');            
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(activity);
        });

        return Object.entries(grouped)
                    .sort((a, b) => Date.parse(b[0]) - Date.parse(a[0]));
    }

    loadActivities = async () => {
        this.setInitialLoading(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(a => this.setActivity(a));

        } catch (e) {
            console.error(e);
        } finally {
            this.setInitialLoading(false);
        }
    }

    setActivity = (activity: Activity) => {
        activity.date = new Date(activity.date!);
        
        const user = store.userStore.user;;
        if (user) {
            activity.isHost = activity.hostUsername === user.username;
            activity.isGoing = activity.profiles?.some(p => p.username === user.username);
            activity.host = activity.profiles?.find(p => p.username === activity.hostUsername);
        }
        

        this.activityRegistry.set(activity.id, activity);
        return activity;
    }

    loadActivity = async (id: string) => {
        if (this.activityRegistry.has(id)) {
            this.selectedActivity = this.activityRegistry.get(id);
            return this.selectedActivity;
        }
        
        try {
            this.setInitialLoading(true);
            const activity = await agent.Activities.details(id);

            runInAction(() => {
                this.selectedActivity = this.setActivity(activity);
            })

            return activity;
        } catch (e) {
            console.error(e);
        } finally {
            this.setInitialLoading(false);
        }
    }

    setInitialLoading = (state: boolean) => {
        this.initialLoading = state;
    }

    private setSelectedActivity = (activity: Activity | undefined) => {
        this.selectedActivity = activity;
    }

    selectActivity = (id: string) => {
        this.setSelectedActivity(this.activityRegistry.get(id));
    }

    unselectActivity = () => {
        this.setSelectedActivity(undefined);
    }

    setLoading = (state: boolean) => {
        this.loading = state;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);

        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity)
            newActivity.hostUsername = user?.username!;
            newActivity.isHost = true;
            newActivity.host = attendee;
            newActivity.profiles = [attendee];

            runInAction(() => {
                this.activityRegistry.set(activity.id!, newActivity);
                this.selectedActivity = newActivity;
            })
        } catch (e) {
            console.error(e);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);

            runInAction(() => {
                Object.assign(this.selectedActivity, activity);
                this.activityRegistry.set(activity.id!, this.selectedActivity!);
            });
        } catch (e) {
            console.error(e);
        }
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true);

        try {
            await agent.Activities.delete(id);

            runInAction(() => {
                this.activityRegistry.delete(id);
            })
        } catch (e) {
            console.error(e);
        } finally {
            this.setLoading(false);
        }
    }

    updateAttendance = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.Activities.attend(id);

            runInAction(() => {
                const user = store.userStore.user;
                if (!user || !this.selectedActivity) return;

                if (this.selectedActivity.isHost) {
                    // cancel or uncancel
                    this.selectedActivity.isCancelled = !this.selectedActivity.isCancelled;
                    this.activityRegistry.set(id, this.selectedActivity);
                } else if (this.selectedActivity.isGoing) {
                    // leave activty 
                    this.selectedActivity.profiles = this.selectedActivity.profiles?.filter(
                        p => p.username !== user.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    // join activity 
                    const newAttendee = new Profile(user);
                    this.selectedActivity.profiles?.push(newAttendee);
                    this.selectedActivity.isGoing = true;
                }
            });
        } catch (e) {
            console.error(e);
        } finally {
            this.setLoading(false);
        }
    }
}