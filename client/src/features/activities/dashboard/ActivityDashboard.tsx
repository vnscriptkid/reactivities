import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';
import Loading from '../../../app/layout/Loading';

function ActivityDashboard() {

    const { activityStore  } = useStore();
    const { loadActivities } = activityStore;
    
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
                <h2>Activity Filters</h2>
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);