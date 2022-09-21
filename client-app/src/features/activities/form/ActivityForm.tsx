import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import { Activity } from '../../../app/models/activity';

// interface Props {
    // selectedActivity: Activity | undefined;
    // closeForm: () => void;
    // onHandleUpsertActivity: (activity: Activity) => void;
    // isLoading: boolean;
// }

export default observer( function ActivityForm() {
    const {activityStore} = useStore();
    const {selectedActivity, closeForm, isLoading, updateActivity, createActivity} = activityStore;
    
    const [activity, setActivity] = useState<Activity>(selectedActivity || {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
      });
      
    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value})
    }

    const hanldleSubmit = () => {
        activity.id ? updateActivity(activity) : createActivity(activity);
    }


    // if(isLoading) return <LoadingComponent content='Submiting...' />
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
            <Button loading={isLoading} floated='right' positive type='submit' content='Submit'/>
            <Button floated='right' type='button' content='Cancel' onClick={closeForm}/>
        </Form>
    </Segment>
  )
})
