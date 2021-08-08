import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Card, Grid, Image } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';

import { useStore } from '../../../app/stores/store';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

function ActivityDetails() {

    const {activityStore} = useStore();
    const { selectedActivity: activity, loadActivity, initialLoading} = activityStore;

    const {id} = useParams<{ id: string }>();
    
    useEffect(() => {
        loadActivity(id);
    }, [loadActivity, id]);
    
    if (!activity || initialLoading) return <Loading />
    
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader />
                <ActivityDetailedInfo />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDetails);