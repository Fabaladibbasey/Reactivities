import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid, Loader } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';

import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';
import { pagingParams } from '../../../app/models/paginations';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';


export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadActivities, initialLoading, setPagingParams, pagination } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    const handleLoadingNext = () => {
        setLoadingNext(true);
        setPagingParams(new pagingParams(activityStore.pagingParams.pageNumber + 1));
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        loadActivities();
    }, []);

    return (
        <Grid>
            <Grid.Column width={10}>
                {initialLoading && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleLoadingNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}

                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}

            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})