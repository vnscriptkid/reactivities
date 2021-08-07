import { action, makeAutoObservable, makeObservable, observable } from "mobx";

export default class ActivityStore {
    title = 'Hello from mobx';

    constructor() {
        makeAutoObservable(this)
    }

    setTitle = () => {
        this.title = this.title + '!!!';
    }
}