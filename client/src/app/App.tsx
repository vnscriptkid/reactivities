import { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import Loading from './layout/Loading';
import { useStore } from './stores/store';
import { observer } from 'mobx-react-lite';

function App() {

  const { activityStore  } = useStore();
  const { openForm, loadActivities } = activityStore;
  
  useEffect(() => { 
    loadActivities();
  }, [loadActivities]);

  if (activityStore.initialLoading) return <Loading />
  
  return (
    <>
      <NavBar openCreateForm={openForm}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);
