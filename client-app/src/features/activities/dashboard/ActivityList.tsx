import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react'
import { Header, Item, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import ActivityListItem from './ActivityListItem';

export default observer(function ActivityList() {
    const { activityStore } = useStore();
    const { groupedActivities } = activityStore;
    // console.log(groupedActivities);

    return (
        <>
            {
                groupedActivities.map(([group, activities]) => {
                    return (
                        <Fragment key={group}>
                            <Header sub color='teal'>
                                {group}
                            </Header>

                            {
                                activities.map(activity => (
                                    <ActivityListItem key={activity.id} activity={activity} />
                                ))
                            }

                        </Fragment>)
                })
            }
        </>
    )
})