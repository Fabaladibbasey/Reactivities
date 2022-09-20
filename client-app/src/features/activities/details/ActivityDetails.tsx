import React from 'react'
import { Button, ButtonGroup, Card, Container } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity';

interface Props {
    activity: Activity;
    onHandleCancelActivity: () => void;
    onHandleOpenForm: (id: string) => void;
}

export default function ActivityDetails({activity, onHandleCancelActivity, onHandleOpenForm} : Props) {
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
                <Button basic color='blue' content='Edit' onClick={() => onHandleOpenForm(activity.id)}/>
                <Button basic color='grey' content='Cancel' onClick={onHandleCancelActivity}/>
            </ButtonGroup>
        </Card.Content>
  </Card>
  )
}

