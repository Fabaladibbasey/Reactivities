import React, { SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store'
import { Activity } from '../../../app/models/activity'

interface Props {
    activity: Activity
}

function ActivityListItem({ activity }: Props) {
    const { activityStore } = useStore();
    const { deleteActivity, isLoading } = activityStore;
    const [target, setTarget] = React.useState('');
    const handleDeleteActivity = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }
    return (

        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by Bob</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {activity.date}
                    <Icon name='marker' /> {activity.venue}, {activity.city}
                </span>
            </Segment>
            <Segment secondary>
                Attendees go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link}
                    to={`/activities/${activity.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
                <Button
                    name={activity.id}
                    loading={isLoading && target === activity.id}
                    onClick={(e) => handleDeleteActivity(e, activity.id)}
                    color='red'
                    floated='right'
                    content='Delete'
                />
            </Segment>

        </Segment.Group>
    )
}

export default ActivityListItem
