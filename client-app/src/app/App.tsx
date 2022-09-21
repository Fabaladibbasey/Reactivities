import { useEffect } from 'react';
import { Container} from 'semantic-ui-react';
import NavBar from './layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './layout/LoadingComponent';
import { useStore } from './api/stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  // const [activities, setActivities] = useState<Activity[]>([]);
  // const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  // const [displayForm, setDisplayForm] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const {activityStore} = useStore();

  // const handleSelectedActivity = (id: string) => {
  //   activityStore.selectActivity(id);
  // }

  // const handleCancelActivity = () => {
  //   setSelectedActivity(undefined);
  //   setDisplayForm(false)
  // }

  // const handleOpenForm = (id?: string) => {
  //   id ? handleSelectedActivity(id) : setSelectedActivity(undefined);
  //   setDisplayForm(true);
  // }

  // const handleCloseForm = () => {
  //   setDisplayForm(false);
  // }

  // const handleUpsertActivity = (activity: Activity) => {
  //   setIsSubmitting(true);
  //   try {
  //     if (activity.id) {
  //       agent.Activities.update(activity).then(
  //         () => 
  //         {
  //           setActivities([...activities.filter(x => x.id !== activity.id), activity])
  //           setSelectedActivity(activity);
  //           setDisplayForm(false);
  //           setIsSubmitting(false);
  //         }
  //       );
  //     } else {
  //       activity.id = uuid();
  //       agent.Activities.create({...activity, activity}).then(
  //         () => {
  //           setActivities([...activities, activity]);
  //           setSelectedActivity(activity);
  //           setDisplayForm(false);
  //           setIsSubmitting(false);
  //         }
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }

  // const handleDeleteActivity = (id: string) => {
  //   setIsSubmitting(true);
  //   agent.Activities.delete(id).then(() => {
  //     setActivities([...activities.filter(x => x.id !== id)]);
  //     setIsSubmitting(false);
  //   });
  // }

  useEffect( () => {
    activityStore.loadActivities();
  }, []);

  if (activityStore.initialLoading) return (<LoadingComponent content='Loading app...' />)
  return (
    <>
      {/* <Header as='h2' icon='users' content='Reactivities' /> */}
      <NavBar />
      <Container style={{marginTop: '6rem'}}>
      <ActivityDashboard 
        // activities={activityStore.activities} 
        // activity={selectedActivity}
        // onHandleSelectedActivity={handleSelectedActivity}
        // onHandleCancelActivity={handleCancelActivity}
        // openForm={displayForm}
        // onHandleOpenForm={handleOpenForm}
        // onHandleCloseForm={handleCloseForm}
        // onHandleUpsertActivity={handleUpsertActivity}
        // onHandleDeleteActivity={handleDeleteActivity}
        // onIsSubmitting={isSubmitting}

        />
      </Container>
    </>
  );
}

export default observer(App);
