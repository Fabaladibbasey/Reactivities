import { observer } from 'mobx-react-lite';
import { Grid} from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

// interface Props {
//     activities: Activity[];
//     activity: Activity | undefined;
//     onHandleSelectedActivity: (id: string) => void;
//     onHandleCancelActivity: () => void;
//     openForm: boolean;
//     onHandleOpenForm: (id: string) => void;
//     onHandleCloseForm: () => void;
//     onHandleUpsertActivity: (activity: Activity) => void;
//     onHandleDeleteActivity: (id: string) => void;
//     onIsSubmitting: boolean;
// }

export default observer( function ActivityDashboard() {
    const {activityStore} = useStore();
    const {displayForm, selectedActivity: activity} = activityStore;
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList 
                    // activities={activities}
                    // onHandleSelectedActivity={onHandleSelectedActivity}
                    // onHandleDeleteActivity={onHandleDeleteActivity}
                    // onIsSubmitting={onIsSubmitting}
                    />
            </Grid.Column>  
            <Grid.Column width={6}>
                {activity && <ActivityDetails 
                    // activity={activity} 
                    // onHandleCancelActivity={onHandleCancelActivity}
                    // onHandleOpenForm={onHandleOpenForm}
                    />
                }
                {displayForm && 
                <ActivityForm 
                    // onHandleCloseForm={onHandleCloseForm} 
                    // selectedActivity={activity} 
                    // onHandleUpsertActivity={onHandleUpsertActivity}
                    // onIsSubmitting={onIsSubmitting}
                    />
                    }
            </Grid.Column>         
        </Grid>
    )
})