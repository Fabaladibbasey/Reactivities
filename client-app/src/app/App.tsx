import React, { useEffect } from 'react'
import { Container } from 'semantic-ui-react';
import NavBar from './layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import ActivityForm from '../features/activities/form/ActivityForm';
import ActivityDetails from '../features/activities/details/ActivityDetails';
import TestErrors from '../features/Errors/TestErrors';
import { ToastContainer } from 'react-toastify';
import NotFound from '../features/Errors/NotFound';
import ServerError from '../features/Errors/ServerError';
import { useStore } from './api/stores/store';
import LoadingComponent from './layout/LoadingComponent';
import ModalContainer from './common/modal/ModalContainer';
import ProfilePage from '../features/profiles/ProfilePage';
import PrivateRoute from './layout/PrivateRoute';
function App() {
  const location = useLocation();
  const { userStore, commonStore } = useStore();

  useEffect(
    () => {
      if (commonStore.token) {
        userStore.getUser().finally(() => commonStore.setAppLoaded());
      } else {
        userStore.getFacebookLoginStatus().finally(() => commonStore.setAppLoaded());

      }
    }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <>

          <NavBar />
          <Container style={{ marginTop: '6rem' }}>
            <Switch>
              <PrivateRoute exact path='/activities' component={ActivityDashboard} />
              <PrivateRoute exact path='/activities/:id' component={ActivityDetails} />
              <PrivateRoute exact key={location.key} path={'/createActivity'} component={ActivityForm} />
              <PrivateRoute exact path='/createActivity/edit/:id' component={ActivityForm} />
              <PrivateRoute exact path='/profiles/:userName' component={ProfilePage} />
              <PrivateRoute exact path='/errors' component={TestErrors} />
              <Route path='/server-error' component={ServerError} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </>
      )} />


    </>
  );
}

export default observer(App);
