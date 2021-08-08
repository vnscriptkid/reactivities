import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';
import Loading from '../../../app/layout/Loading';
import ActivityFilters from './ActivityFilters';

function ActivityDashboard() {

    const { activityStore  } = useStore();
    const { loadActivities, activityRegistry } = activityStore;
    
    useEffect(() => { 
        if (activityRegistry.size < 2) {
            loadActivities();
        }
    }, [loadActivities, activityRegistry]);
  
    if (activityStore.initialLoading) return <Loading />

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);