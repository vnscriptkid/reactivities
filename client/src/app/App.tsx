import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/Activity';
import NavBar from '../layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleActivitySelected = (activity: Activity) => setSelectedActivity(activity);
  const handleActivityCancelled = () => setSelectedActivity(null);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
      .then(res => {
        setActivities(res.data);
      });
  }, []);
  
  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          handleActivitySelected={handleActivitySelected}
          handleActivityCancelled={handleActivityCancelled}
        />
      </Container>
    </>
  );
}

export default App;
