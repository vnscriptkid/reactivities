import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import { Activity } from "../models/Activity";

export default class ActivityStore {
    activities: Activity[] = [];
    initialLoading = false;
    selectedActivity: Activity | undefined = undefined;
    isFormOpen = false;
    loading = false;

    constructor() {
        makeAutoObservable(this)
    }

    loadActivities = async () => {
        this.setInitialLoading(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(a => {
                a.date = a.date.split('T')[0]
                this.activities.push(a);
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

    selectActivity = (activity: Activity) => {
        this.setSelectedActivity(activity);
    }

    unselectActivity = () => {
        this.setSelectedActivity(undefined);
    }

    openForm = (activity?: Activity) => {
        this.setSelectedActivity(activity);
        
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
                this.activities.push(newActivity);
                this.closeForm();
                this.selectActivity(activity);
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
                const index = this.activities.findIndex(a => a.id === activity.id);
                if (index > -1) this.activities[index] = activity;
                
                this.closeForm();
                this.selectActivity(activity);
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
                this.activities = this.activities.filter(a => a.id !== id);
                if (this.selectedActivity?.id === id) this.unselectActivity();
            })
        } catch (e) {
            console.error(e);
        } finally {
            this.setLoading(false);
        }
    }
}