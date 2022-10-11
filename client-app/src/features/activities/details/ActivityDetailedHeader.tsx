import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image, Label, } from 'semantic-ui-react'
import { Activity } from "../../../app/models/activity";
import { format } from 'date-fns';
import { useStore } from '../../../app/api/stores/store';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

export default observer(function ActivityDetailedHeader({ activity }: Props) {
    const { activityStore: { isLoading, updateAttendance, } } = useStore();
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                {activity.isCancelled &&
                    <Label style={{ position: 'absolute', left: '-14', top: '20', zIndex: '100' }} ribbon color='red' content="Cancelled" />

                }
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle} />
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{activity.date && format(activity.date, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong>
                                        <Link to={`/profile/${activity.host && activity.host.userName}`}>
                                            {activity.host && activity.host.displayName}
                                        </Link>
                                    </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>

                {activity.isHost ?
                    <Button loading={isLoading} onClick={updateAttendance} className={`${activity.isCancelled ? 'green' : 'basic red'}`}>{
                        activity.isCancelled ? 'Reactivate Activity' : 'Cancel Activity'
                    }</Button>
                    :
                    <Button loading={isLoading} onClick={updateAttendance} color='teal'>{
                        activity.isGoing ? 'Cancel attendance' : 'Join Activity'
                    }</Button>
                }

                {
                    activity.isHost && <Button as={Link} to={`/createActivity/edit/${activity.id}`} color='orange' floated='right' disabled={activity.isCancelled}>
                        Manage Event
                    </Button>
                }
            </Segment>
        </Segment.Group>
    )
})

