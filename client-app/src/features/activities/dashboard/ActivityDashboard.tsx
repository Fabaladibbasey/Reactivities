import React from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';

import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';


export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    useEffect(() => {
        activityStore.loadActivities();
    }, []);

    const { initialLoading } = activityStore;
    if (initialLoading) return (<LoadingComponent content='Loading app...' />)

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
})