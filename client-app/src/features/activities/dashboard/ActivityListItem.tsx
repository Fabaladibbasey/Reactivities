import React, { SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store'
import { Activity } from '../../../app/models/activity'
import { format } from 'date-fns'
import ActivityListItemAttendee from './ActivityListItemAttendee'

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
                {activity.isCancelled &&
                    <Label attached='top' color='red' content='Cancelled' style={{ textAlign: 'center' }} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image style={{ marginBottom: 4 }} size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by {activity.host && activity.host.displayName}</Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color='orange'>
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color='green'>
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}

                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' /> {activity.venue}, {activity.city}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
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
                {
                    activity.isHost &&
                    <Button
                        name={activity.id}
                        loading={isLoading && target === activity.id}
                        onClick={(e) => handleDeleteActivity(e, activity.id)}
                        color='red'
                        floated='right'
                        content='Delete'
                    />
                }
            </Segment>

        </Segment.Group>
    )
}

export default ActivityListItem
