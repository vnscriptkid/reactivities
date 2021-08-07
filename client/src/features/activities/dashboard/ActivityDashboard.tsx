import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/Activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props {
    activities: Activity[];
    selectedActivity?: Activity;
    selectActivity: (activity: Activity) => void;
    cancelSelectActivity: () => void;
    openEditMode: (activity: Activity | undefined) => void;
    cancelEditMode: () => void;
    editMode: boolean;
    createOrUpdate: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default function ActivityDashboard({
    activities, 
    cancelSelectActivity, 
    selectActivity, 
    selectedActivity,
    openEditMode,
    cancelEditMode,
    editMode,
    createOrUpdate,
    deleteActivity,
    submitting
} : Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList 
                    activities={activities} 
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                    submitting={submitting}
                    />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode && <ActivityDetails 
                    activity={selectedActivity}
                    cancelSelectActivity={cancelSelectActivity}
                    openEditMode={openEditMode}
                />}
                {editMode && <ActivityForm 
                    selectedActivity={selectedActivity}
                    cancelEditMode={cancelEditMode}
                    createOrUpdate={createOrUpdate}
                    submitting={submitting}
                />}
            </Grid.Column>
        </Grid>
    );
}