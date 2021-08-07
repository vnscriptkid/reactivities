import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';
import Loading from '../../../app/layout/Loading';

function ActivityDashboard() {

    const { activityStore  } = useStore();
    const { loadActivities, selectedActivity, isFormOpen } = activityStore;
    
    useEffect(() => { 
      loadActivities();
    }, [loadActivities]);
  
    if (activityStore.initialLoading) return <Loading />

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !isFormOpen && <ActivityDetails 
                    activity={selectedActivity}
                />}
                {isFormOpen && <ActivityForm  />}
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);