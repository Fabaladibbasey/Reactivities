import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Divider, Header, Segment } from 'semantic-ui-react'
import { useStore } from '../../app/api/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

declare var google: any;

function HomePage() {
  const { userStore, modalStore, commonStore } = useStore();

  useEffect(() => {

    if (!commonStore.token) {
      google.accounts.id.initialize({
        client_id: "657495905393-lb0lcqjjipnugcs75m708q3ee4nvf7bg.apps.googleusercontent.com",
        callback: userStore.googleLogin,
      });

      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }  // customization attributes
      );

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.log("Prompt was not displayed");
        } else if (notification.isSkippedMoment()) {
          console.log("Prompt was skipped");
        } else if (notification.isDismissedMoment()) {
          console.log("Prompt was dismissed");
        }
      });

    }


  }, [commonStore.token, userStore])


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
            <Divider horizontal inverted>Or</Divider>
            <Button
              loading={userStore.fbLoading}
              content='Login with Facebook'
              icon='facebook'
              color='facebook'
              size='huge'
              inverted
              onClick={userStore.facebookLogin}
            />
            <Divider horizontal inverted>Or</Divider>
            <Button
              id="buttonDiv"
              loading={userStore.googleLoading}
              // content='Login with Google'
              icon='google'
              // color='google plus'
              // size='huge'
              inverted

            />

          </>

        )}

      </Container>
    </Segment>

  )
}

export default HomePage