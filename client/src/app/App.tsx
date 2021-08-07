import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/Activity';
import NavBar from '../layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState<boolean>(false);
  
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
      .then(res => {
        setActivities(res.data);
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

  function handleCreateOrUpdateActivity (activity: Activity) {
    if (activity.id) setActivities(activities.map(a => a.id === activity.id ? activity : a));
    else setActivities([...activities, { ...activity, id: uuid() }])

    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity (id: string) {
    setActivities(activities.filter(a => a.id !== id));
  }
  
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
        />
      </Container>
    </>
  );
}

export default App;
