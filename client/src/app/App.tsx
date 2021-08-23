import { Container } from "semantic-ui-react";
import NavBar from "./layout/NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, useLocation } from "react-router-dom";
import HomePage from "../features/home/HomePage";
import ActivityForm from "../features/activities/form/ActivityForm";
import ActivityDetails from "../features/activities/details/ActivityDetails";
import { useStore } from "./stores/store";
import { useEffect } from "react";
import Loading from "./layout/Loading";
import ModalContainer from "./common/modals/ModalContainer";
import ProfilePage from "../features/profiles/ProfilePage";
import PrivateRoute from "./layout/PrivateRoute";

function App() {
  const { key } = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      userStore.getFbLoginStatus().then(() => commonStore.setAppLoaded());
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) return <Loading content="App loading..." />;

  return (
    <>
      <ModalContainer />
      <Route exact path="/" component={HomePage} />
      <Route
        path="/(.+)"
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <PrivateRoute
                exact
                path="/activities"
                component={ActivityDashboard}
              />
              <PrivateRoute
                path="/activities/:id"
                component={ActivityDetails}
              />
              <PrivateRoute
                path="/profiles/:username"
                component={ProfilePage}
              />
              <PrivateRoute
                key={key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
