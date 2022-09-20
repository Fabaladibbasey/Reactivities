import React, { useEffect, useState } from 'react';
import axios from 'axios';  
import { Container} from 'semantic-ui-react';
import { Activity } from './models/activity';
import NavBar from './layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [displayForm, setDisplayForm] = useState(false);

  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id));
    handleCloseForm();
  }

  const handleCancelActivity = () => {
    setSelectedActivity(undefined);
    setDisplayForm(false)
  }

  const handleOpenForm = (id?: string) => {
    id ? handleSelectedActivity(id) : setSelectedActivity(undefined);
    setDisplayForm(true);
  }

  const handleCloseForm = () => {
    setDisplayForm(false);
  }

  const handleUpsertActivity = (activity: Activity) => {
    activity.id ? setActivities([...activities.filter(x => x.id !== activity.id), activity]) : setActivities([...activities, {...activity, id: uuid()}]);
    setSelectedActivity(activity);
    setDisplayForm(false);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  useEffect( () => {
    axios.get<Activity[]>('https://localhost:7126/api/Activities').then(response => {
      setActivities(response.data);
    }).catch( error => {
      console.log(error);
    })
  }, [])
  return (
    <>
      {/* <Header as='h2' icon='users' content='Reactivities' /> */}
      <NavBar onHandleOpenForm={handleOpenForm} />
      <Container style={{marginTop: '6rem'}}>
      <ActivityDashboard 
        activities={activities} 
        activity={selectedActivity}
        onHandleSelectedActivity={handleSelectedActivity}
        onHandleCancelActivity={handleCancelActivity}
        openForm={displayForm}
        onHandleOpenForm={handleOpenForm}
        onHandleCloseForm={handleCloseForm}
        onHandleUpsertActivity={handleUpsertActivity}
        onHandleDeleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
