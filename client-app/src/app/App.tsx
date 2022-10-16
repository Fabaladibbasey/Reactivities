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
import LoginForm from '../features/users/LoginForm';
import { useStore } from './api/stores/store';
import LoadingComponent from './layout/LoadingComponent';
import ModalContainer from './common/modal/ModalContainer';
import ProfilePage from '../features/profiles/ProfilePage';
function App() {
  const location = useLocation();
  const { userStore, commonStore } = useStore();

  // if (commonStore.token) {
  //   if (!userStore.user) {
  //     userStore.getUser().finally(() => commonStore.setAppLoaded());
  //   }
  // }


  useEffect(
    () => {
      if (commonStore.token) {
        userStore.getUser().finally(() => commonStore.setAppLoaded());
      } else {
        commonStore.setAppLoaded();
      }
    },
    [commonStore, userStore])

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
              <Route exact path='/activities' component={ActivityDashboard} />
              <Route exact path='/activities/:id' component={ActivityDetails} />
              <Route exact key={location.key} path={'/createActivity'} component={ActivityForm} />
              <Route exact path='/createActivity/edit/:id' component={ActivityForm} />
              <Route exact path='/profiles/:userName' component={ProfilePage} />
              <Route exact path='/errors' component={TestErrors} />
              <Route path='/server-error' component={ServerError} />
              <Route path='/login' component={LoginForm} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </>
      )} />


    </>
  );
}

export default observer(App);
