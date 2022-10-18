import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';


export default observer(function ActivityDetails() {
    const { activityStore } = useStore();
    const { id } = useParams<{ id: string }>();
    const { selectedActivity: activity, loadActivity, clearSelectedActivity } = activityStore;

    useEffect(() => {
        if (id) loadActivity(id);
        return () => {
            clearSelectedActivity();
        }
    }, [id, loadActivity, clearSelectedActivity]);



    if (!activity) return <LoadingComponent content='Activity loading...' />
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat activityId={activity.id} />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar activity={activity} />
            </Grid.Column>
        </Grid>
    )
})
