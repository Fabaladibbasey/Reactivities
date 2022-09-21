import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Activity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';



export default observer( function ActivityForm() {
    const {activityStore} = useStore();
    const {isLoading, initialLoading, createActivity, updateActivity, loadActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    const history = useHistory();
    
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
        if (id) loadActivity(id)
        .then( activity => setActivity(activity!));
        }, [loadActivity]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value})
    }

    const hanldleSubmit = () => {
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            
           createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        }else{
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        } 
    }

   if(initialLoading) return <LoadingComponent content='Loading activity...' /> 

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
            <Button floated='right' type='button' content='Cancel' as={Link} to='/'/>
        </Form>
    </Segment>
  )
})
