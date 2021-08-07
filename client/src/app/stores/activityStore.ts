import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import { Activity } from "../models/Activity";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    initialLoading = true;
    selectedActivity: Activity | undefined = undefined;
    isFormOpen = false;
    loading = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate () {
        return Array.from(this.activityRegistry.values())
                .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        this.setInitialLoading(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(a => {
                a.date = a.date.split('T')[0]
                this.activityRegistry.set(a.id, a);
            });
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

    openForm = () => {
        this.isFormOpen = true;
    }

    closeForm = () => {
        this.isFormOpen = false;
    }

    setLoading = (state: boolean) => {
        this.loading = state;
    }

    createActivity = async (activity: Activity) => {
        this.setLoading(true);
        const newActivity: Activity = { ...activity, id: uuid() };
    
        try {
            await agent.Activities.create(newActivity);

            runInAction(() => {
                this.activityRegistry.set(newActivity.id, activity);
                this.closeForm();
                this.selectActivity(newActivity.id);
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
                
                this.closeForm();
                this.selectActivity(activity.id);
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

                if (this.selectedActivity?.id === id) this.unselectActivity();
            })
        } catch (e) {
            console.error(e);
        } finally {
            this.setLoading(false);
        }
    }
}