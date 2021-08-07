import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/Activity";

export default class ActivityStore {
    title = 'Hello from mobx';
    activities: Activity[] = [];
    initialLoading = false;

    constructor() {
        makeAutoObservable(this)
    }

    setTitle = () => {
        this.title = this.title + '!!!';
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
}