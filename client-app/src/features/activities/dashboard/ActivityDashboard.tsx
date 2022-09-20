import React from 'react'
import { Grid, GridColumn, List, ListItem } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props {
    activities: Activity[];
    activity: Activity | undefined;
    onHandleSelectedActivity: (id: string) => void;
    onHandleCancelActivity: () => void;
    openForm: boolean;
    onHandleOpenForm: (id: string) => void;
    onHandleCloseForm: () => void;
    onHandleUpsertActivity: (activity: Activity) => void;
    onHandleDeleteActivity: (id: string) => void;
}

export default function ActivityDashboard({activities, activity, onHandleSelectedActivity, onHandleCancelActivity, openForm, onHandleOpenForm, onHandleCloseForm, onHandleUpsertActivity, onHandleDeleteActivity} : Props) {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList 
                    activities={activities}
                    onHandleSelectedActivity={onHandleSelectedActivity}
                    onHandleDeleteActivity={onHandleDeleteActivity}
                    />
            </Grid.Column>  
            <Grid.Column width={6}>
                {activity && <ActivityDetails 
                    activity={activity} 
                    onHandleCancelActivity={onHandleCancelActivity}
                    onHandleOpenForm={onHandleOpenForm}
                    />
                }
                {openForm && <ActivityForm onHandleCloseForm={onHandleCloseForm} selectedActivity={activity} onHandleUpsertActivity={onHandleUpsertActivity}/>}
            </Grid.Column>         
        </Grid>
    )
}