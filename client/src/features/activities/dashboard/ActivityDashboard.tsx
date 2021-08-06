import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../models/Activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props {
    activities: Activity[];
    selectedActivity: Activity | null;
    handleActivitySelected: (activity: Activity) => void;
    handleActivityCancelled: () => void;
}

export default function ActivityDashboard({activities, handleActivityCancelled, handleActivitySelected, selectedActivity} : Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList 
                    activities={activities} 
                    handleActivitySelected={handleActivitySelected}/>
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && <ActivityDetails 
                    activity={selectedActivity}
                    handleActivityCancelled={handleActivityCancelled}
                />}
                <ActivityForm />
            </Grid.Column>
        </Grid>
    );
}