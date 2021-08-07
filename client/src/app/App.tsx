import { useEffect, useState } from 'react';
import { Button, Container } from 'semantic-ui-react';
import { Activity } from './models/Activity';
import NavBar from './layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from './api/agent';
import Loading from './layout/Loading';
import { useStore } from './stores/store';
import { observer } from 'mobx-react-lite';

function App() {

  const { activityStore } = useStore();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSumitting] = useState(false);
  
  useEffect(() => { 
    activityStore.loadActivities();
  }, [activityStore]);

  function selectActivity (activity: Activity) {
    setSelectedActivity(activity);
  } 
  function cancelSelectActivity () {
    setSelectedActivity(undefined);
  } 

  function openEditMode (activity: Activity | undefined) {
    setSelectedActivity(activity);
    setEditMode(true);
  }

  function cancelEditMode () {
    setEditMode(false);
  }

  async function handleCreateOrUpdateActivity (activity: Activity) {
    setSumitting(true);
    
    if (activity.id) { // update activity
      await agent.Activities.update(activity)

      setActivities(activities.map(a => a.id === activity.id ? activity : a));
    }
    else { // create activity
      const newActivity: Activity = { ...activity, id: uuid() };

      await agent.Activities.create(newActivity);
      
      setActivities([...activities, activity ])
    }

    setSumitting(false);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  async function deleteActivity (id: string) {
    setSumitting(true)
    await agent.Activities.delete(id);
    setSumitting(false)
    setActivities(activities.filter(a => a.id !== id));
  }

  if (activityStore.initialLoading) return <Loading />
  
  return (
    <>
      <NavBar openEditMode={openEditMode}/>
      <Container style={{marginTop: '7em'}}>
        <h2>{activityStore.title}</h2>
        <Button content='Add one !' onClick={activityStore.setTitle} />
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={selectActivity}
          cancelSelectActivity={cancelSelectActivity}
          openEditMode={openEditMode}
          cancelEditMode={cancelEditMode}
          editMode={editMode}
          createOrUpdate={handleCreateOrUpdateActivity}
          deleteActivity={deleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default observer(App);
