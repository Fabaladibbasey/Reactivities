import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react'
import { Button, Item, Label, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import { Activity } from '../../../app/models/activity';

// interface Props {
    // activities: Activity[];
    // onHandleSelectedActivity: (id: string) => void;
    // onHandleDeleteActivity: (id: string) => void;
    // onIsSubmitting: boolean;
// }

export default observer ( function ActivityList(){
    const {activityStore} = useStore();
    const {activitiesByDate, selectActivity, deleteActivity, isLoading} = activityStore;
    const [target, setTarget] = React.useState('');
    const handleDeleteActivity = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }
    return (
        <Segment>
            <Item.Group divided>
                {
                activitiesByDate.map(activity => (
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header as='a'>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date + ''}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city}, {activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button floated='right' content='View' color='blue' onClick={() => selectActivity(activity.id)} />
                                    <Button 
                                        name={activity.id}
                                        loading={isLoading && target === activity.id} floated='right' content='Delete' color='red' onClick={(e) => handleDeleteActivity(e, activity.id)} />
                                    <Label basic content={activity.category} />
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))
                }
            </Item.Group>
        </Segment>
    )
})