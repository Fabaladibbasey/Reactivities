import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header, Segment } from 'semantic-ui-react'
import { useStore } from '../../app/api/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

function HomePage() {
  const { userStore, modalStore } = useStore();
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <h1 className='ui inverted stackable header'>
          <img src='/assets/logo.png' alt='logo' className='ui image massive' />
          <div className='content'>Reactivities</div>
        </h1>

        {userStore.isLoggedIn ? (
          <>
            <h2 className='ui inverted stackable header'>
              {`Welcome to Reactivities ${userStore.user!.displayName}`}
            </h2>
            <Button as={Link} to='/activities' size='huge' inverted>Go to Activities</Button>
          </>

        ) : (

          <>
            <h2>Do whatever you wanted to do</h2>
            <h3>Go ahead and </h3>
            <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' color='teal'>Login!</Button>
            <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' color='teal'>Register!</Button>
          </>

        )}

      </Container>
    </Segment>

  )
}

export default HomePage