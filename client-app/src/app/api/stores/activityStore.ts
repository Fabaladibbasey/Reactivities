import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../../models/activity";
import { Pagination, pagingParams } from "../../models/paginations";
import { Profile } from "../../models/profile";
import agent from "../agent";
import { store } from "./store";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    initialLoading: boolean = false;
    isLoading: boolean = false;
    displayForm: boolean = false;
    pagination: Pagination | null = null;
    pagingParams = new pagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new pagingParams();
                this.activityRegistry.clear();
                this.loadActivities();
            })

    }


    setPagingParams = (pagingParams: pagingParams) => {
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }

        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
                break;

        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString());
            } else {
                params.append(key, value);
            }
        })

        return params;
    }

    loadActivities = async () => {
        this.setInitialLoading(true);
        try {
            let paginationResult = await agent.Activities.list(this.axiosParams);
            runInAction(() => {
                paginationResult.data.forEach(activity => {
                    this.setActivity(activity);
                })

                this.pagination = paginationResult.pagination;
            })

        }
        catch (error) {
            console.log(error);
        } finally {
            this.setInitialLoading(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.setInitialLoading(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                return activity;
            }
            catch (error) {
                console.log(error);
            } finally {
                this.setInitialLoading(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        let user = store.userStore.user;

        if (user) {

            activity.isGoing = activity.attendees!.some(a => a.userName === user!.userName);

            activity.isHost = activity.hostUsername === user!.userName;
            activity.host = activity.attendees!.find(x => x.userName === activity.hostUsername);

        }

        activity.date = new Date(activity.date!);


        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setInitialLoading = (initialLoading: boolean) => {
        this.initialLoading = initialLoading;
    }

    setLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    }

    // setActivity = (activity: Activity) => {
    //     activity.date = new Date(activity.date!);
    //     this.activityRegistry.set(activity.id, activity);
    // }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.attendees = [attendee];
            newActivity.hostUsername = user!.userName;
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {

        try {
            await agent.Activities.update(activity);
            const updatedActivity = { ...this.getActivity(activity.id!), ...activity };
            this.setActivity(updatedActivity as Activity);
            runInAction(() => {
                // this.activityRegistry.set(activity.id!, updatedActivity as Activity);
                this.selectedActivity = updatedActivity as Activity;
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                // this.activities = [...this.activities.filter(a => a.id !== id)];
                this.activityRegistry.delete(id);
                this.selectedActivity = undefined;
                this.displayForm = false;
            })
        }
        catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.setLoading(false);
            })
        }
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        // return Object.entries(
        //     this.activitiesByDate.reduce((activities, activity) => {
        //         const date = activity.date;
        //         activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        //         return activities;
        //     }, {} as {[key: string]: Activity[]})
        // )
        let result = this.activitiesByDate.reduce((activities, activity) => {
            const date = activity.date!.toISOString().split('T')[0]!;
            activities[date] = activities[date] || [];
            activities[date].push(activity);
            return activities;
        }, {} as { [key: string]: Activity[] })

        return Object.entries(result);
    }

    updateAttendance = async () => {

        const user = store.userStore.user;
        this.setLoading(true);
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity!.isGoing && !this.selectedActivity!.isHost) {
                    this.selectedActivity!.attendees = this.selectedActivity!.attendees!.filter(a => a.userName !== user!.userName);
                } else if (!this.selectedActivity!.isGoing && !this.selectedActivity!.isHost) {
                    let attendee = new Profile(user!);
                    this.selectedActivity!.attendees!.push(attendee);
                }

                if (this.selectedActivity!.isHost) {
                    this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                }
                this.setActivity(this.selectedActivity!);
            })
        }
        catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);

        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.userName === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }
}