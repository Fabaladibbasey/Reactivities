import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../../models/activity";
import agent from "../agent";
import { v4 as uuid } from 'uuid';

export default class ActivityStore{
    // activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    initialLoading: boolean = false;
    isLoading: boolean = false;
    displayForm: boolean = false;

    constructor(){
        makeAutoObservable(this);
    }
    
    setDisplayForm = (display: boolean) => {
        this.displayForm = display;
    }

    loadActivities = async () => {
        this.setInitialLoading(true);
        try{
            let activities = await agent.Activities.list();
            runInAction(() => { 
                // this.activities = [...activities.map(activity => {
                //     return {...activity, date: activity.date.split('T')[0]}
                // })]

                activities.forEach(activity => {
                   this.activityRegistry.set(activity.id, {...activity, date: activity.date.split('T')[0]});
                })
            })
            
        }
        catch(error){
            console.log(error);
        }finally{
            this.setInitialLoading(false);
        }
    }
        
    setInitialLoading = (initialLoading: boolean) => {
        this.initialLoading = initialLoading;
    }

    setLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    }

    selectActivity = (id: string) => {
        // this.selectedActivity = this.activities.find(activity => activity.id === id);
        this.selectedActivity = this.activityRegistry.get(id);
        this.setDisplayForm(false);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
        this.setDisplayForm(false);
    }

    openForm = (id?: string) => {
        this.selectedActivity = undefined;
        this.setDisplayForm(false)
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
       setTimeout(() => {
              this.setDisplayForm(true)
         }, 0);
    }

    closeForm = () => {
        this.displayForm = false;
    }
    
    createActivity = async (activity: Activity) => {
        this.setLoading(true);
        try{
            activity.id = uuid();
            await agent.Activities.create(activity);
            runInAction(() => {
                // this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.displayForm = false;
            })
        }
        catch(error){
            console.log(error);
        }finally{
            runInAction(() => {
                this.setLoading(false);
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.setLoading(true);
        try{
            await agent.Activities.update(activity);
            runInAction(() => {
                // this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.displayForm = false;
            })
        }
        catch(error){
            console.log(error);
        }finally{
            runInAction(() => {
                this.setLoading(false);
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true);
        try{
            await agent.Activities.delete(id);
            runInAction(() => {
                // this.activities = [...this.activities.filter(a => a.id !== id)];
                this.activityRegistry.delete(id);
                this.selectedActivity = undefined;
                this.displayForm = false;
            })
        }
        catch(error){
            console.log(error);
        }finally{
            runInAction(() => {
                this.setLoading(false);
            })
        }
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

}