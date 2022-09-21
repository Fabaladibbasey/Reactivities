import React from 'react'
import { Container } from 'semantic-ui-react';
import NavBar from './layout/NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import ActivityForm from '../features/activities/form/ActivityForm';
import ActivityDetails from '../features/activities/details/ActivityDetails';

function App() {
  const location = useLocation();
  return (
    <>
      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <>

          <NavBar />
          <Container style={{ marginTop: '6rem' }}>
            <Route exact path='/activities' component={ActivityDashboard} />
            <Route exact path='/activities/:id' component={ActivityDetails} />
            <Route exact key={location.key} path={'/createActivity'} component={ActivityForm} />
            <Route exact path='/createActivity/edit/:id' component={ActivityForm} />

          </Container>
        </>
      )} />


    </>
  );
}

export default observer(App);
