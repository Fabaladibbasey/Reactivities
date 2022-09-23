import React from 'react'
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
function App() {
  const location = useLocation();
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
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
              <Route exact path='/errors' component={TestErrors} />
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
