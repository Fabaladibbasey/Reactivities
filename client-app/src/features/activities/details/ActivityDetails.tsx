import { observer } from 'mobx-react-lite';
import React from 'react'
import { Button, ButtonGroup, Card, Container } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';


export default observer( function ActivityDetails() {
    const {activityStore} = useStore();
    const {selectedActivity: activity, openForm, cancelSelectedActivity} = activityStore;
    if(!activity) return <LoadingComponent content='Activity loading...' />
  return (
    <Card fluid>
        <Container>
            <img src={`/assets/categoryImages/${activity.category}.jpg`} alt="Category image" style={{width: "100%", objectFit: 'cover'}} />
        </Container>
        <Card.Content>
            <Card.Header>{activity.title}</Card.Header>
            <Card.Meta>
                <span className='date'>{activity.date + ''}</span>
            </Card.Meta>
            <Card.Description>
            {activity.description}
            </Card.Description>
            </Card.Content>
        <Card.Content extra>
            <ButtonGroup widths={2}>
                <Button basic color='blue' content='Edit' onClick={() => openForm(activity.id)}/>
                <Button basic color='grey' content='Cancel' onClick={cancelSelectedActivity}/>
            </ButtonGroup>
        </Card.Content>
  </Card>
  )
})
