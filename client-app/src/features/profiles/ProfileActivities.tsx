import { format } from 'date-fns';
import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Card, Grid, Header, Tab, TabProps, Image } from 'semantic-ui-react'
import { useStore } from '../../app/api/stores/store';
import { UserActivity } from '../../app/models/profile';


function ProfileActivities() {

    const { profile, loadingActivities, loadUserActivities, userActivities } = useStore().profileStore;

    useEffect(() => {
        loadUserActivities(profile!.userName, 'future');
    }, [loadUserActivities, profile]);


    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        loadUserActivities(profile!.userName, panes[data.activeIndex as
            number].menuItem.split(' ')[0].toLowerCase());
    };


    const panes = [
        { menuItem: 'Future Event' },
        { menuItem: 'Pass Event' },
        { menuItem: 'Hosting' },

    ]

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar'
                        content={'Activities'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userActivities && userActivities.map((activity: UserActivity) => (
                            <Card
                                as={Link}
                                to={`/activities/${activity.id}`}
                                key={activity.id}>
                                <Image
                                    src={`/assets/categoryImages/${activity.category}.jpg`}
                                    style={{
                                        minHeight: 100, objectFit:
                                            'cover'
                                    }}
                                />
                                <Card.Content>
                                    <Card.Header
                                        textAlign='center'>{activity.title}</Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div>{format(new Date(activity.date),
                                            'do LLL')}</div>
                                        <div>{format(new Date(activity.date),
                                            'h:mm a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}

export default observer(ProfileActivities)