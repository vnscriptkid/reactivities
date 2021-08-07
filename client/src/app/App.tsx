import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/Activity';
import NavBar from '../layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import Loading from '../layout/Loading';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSumitting] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    agent.Activities.list().then(data => {
      setLoading(false);
      setActivities(data.map(a => ({ ...a, date: a.date.split('T')[0] })))
    });  
  }, []);

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

  function handleDeleteActivity (id: string) {
    setActivities(activities.filter(a => a.id !== id));
  }

  if (loading) return <Loading />
  
  return (
    <>
      <NavBar openEditMode={openEditMode}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={selectActivity}
          cancelSelectActivity={cancelSelectActivity}
          openEditMode={openEditMode}
          cancelEditMode={cancelEditMode}
          editMode={editMode}
          createOrUpdate={handleCreateOrUpdateActivity}
          handleDeleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
