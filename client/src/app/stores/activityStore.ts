import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/Activity";

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
            activities.forEach(a => this.storeActivity(a));

        } catch (e) {
            console.error(e);
        } finally {
            this.setInitialLoading(false);
        }
    }

    storeActivity = (activity: Activity) => {
        activity.date = new Date(activity.date!);
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
                this.selectedActivity = this.storeActivity(activity);
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

    createActivity = async (activity: Activity) => {
        this.setLoading(true);
        try {
            await agent.Activities.create(activity);

            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            })
        } catch (e) {
            console.error(e);
        } finally {
            this.setLoading(false);
        }
    }

    updateActivity = async (activity: Activity) => {
        this.setLoading(true);
    
        try {
            await agent.Activities.update(activity)

            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            })
        } catch (e) {
            console.error(e);
        } finally {
            this.setLoading(false);
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
}