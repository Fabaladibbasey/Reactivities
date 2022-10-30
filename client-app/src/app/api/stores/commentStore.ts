import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment, CommentFormValues } from "../../models/comment";
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
                .withUrl(process.env.REACT_APP_CHAT_URL + '?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user!.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection
                .start()
                // .then(() => console.log(this.hubConnection!.state))
                // .then(() => {
                //     console.log('Attempting to join group');
                //     this.hubConnection!.invoke('AddToGroup', activityId);
                // })
                .catch(error => console.log('Error establishing connection: ', error));

            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment);
                })
            })

            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'Z');
                        this.comments.push(comment);
                    })
                })
            })

        }
    }

    stopHubConnection = () => {
        this.hubConnection!.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: CommentFormValues) => {
        // values.activityId = store.activityStore.selectedActivity!.id;
        try {
            if (this.hubConnection) {
                await this.hubConnection.invoke<ChatComment>('SendComment', values);
            }

        } catch (error) {
            console.log(error);
        }
    }

}


