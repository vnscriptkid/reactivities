import { Container } from 'semantic-ui-react';
import NavBar from './layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import ActivityForm from '../features/activities/form/ActivityForm';
import ActivityDetails from '../features/activities/details/ActivityDetails';
import LoginForm from '../features/users/LoginForm';
import { useStore } from './stores/store';
import { useEffect } from 'react';
import Loading from './layout/Loading';

function App() {

  const {key} = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) return <Loading content='App loading...' />

  return (
    <>
      <Route exact path='/' component={HomePage} />
      <Route path='/(.+)' render={() => (
        <>
          <NavBar />
          <Container style={{marginTop: '7em'}}>
            <Route exact path='/activities' component={ActivityDashboard} />
            <Route path='/activities/:id' component={ActivityDetails} />
            <Route key={key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
            <Route path='/login' component={LoginForm} />
          </Container>
        </>
      )}/>
    </>
  );
}

export default observer(App);
