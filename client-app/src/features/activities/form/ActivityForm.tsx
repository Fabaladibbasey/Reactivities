import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity';

interface Props {
    selectedActivity: Activity | undefined;
    onHandleCloseForm: () => void;
    onHandleUpsertActivity: (activity: Activity) => void;
}

export default function ActivityForm({onHandleCloseForm, selectedActivity, onHandleUpsertActivity} : Props) {
    
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
      });

      useEffect(() => {
        if (selectedActivity) setActivity(selectedActivity);
        }, []);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value})
    }

    const hanldleSubmit = () => {
        onHandleUpsertActivity(activity);
    }

  return (
    <Segment clearing>
        <Form onSubmit={hanldleSubmit}>
            <Form.Input placeholder="Title" value={activity.title} name='title' onChange={handleInputChange} />
            <Form.TextArea 
                placeholder="Description"
                value={activity.description} 
                name='description' 
                onChange={handleInputChange}
                />
            <Form.Input placeholder="Category" 
                value={activity.category} 
                name='category' 
                onChange={handleInputChange}/>
            <Form.Input type='date' 
                placeholder="Date" 
                value={activity.date} 
                name='date' 
                onChange={handleInputChange}/>
            <Form.Input
                placeholder="City"
                value={activity.city} 
                name='city' 
                onChange={handleInputChange} />
            <Form.Input 
                placeholder="Venue" 
                value={activity.venue} 
                name='venue' 
                onChange={handleInputChange} />
            <Button floated='right' positive type='submit' content='Submit' />
            <Button floated='right' type='button' content='Cancel' onClick={onHandleCloseForm}/>
        </Form>
    </Segment>
  )
}
