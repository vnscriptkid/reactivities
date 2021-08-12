import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/Comment";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`http://localhost:5000/chat?activityId=${activityId}`, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start()
                .catch(err => console.error("Err while establishing connection to chat hub: ", err));

            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => this.comments = comments);
            });

            this.hubConnection.on('ReceiveComments', (comment: ChatComment) => {
                runInAction(() => this.comments.push(comment));
            });
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop()
            .catch(err => console.error('Err stopping chat hub connection: ', err));
    }

    clearComments = () => {
        this.stopHubConnection();
        this.comments = [];
    }
} 