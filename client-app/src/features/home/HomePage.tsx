import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Segment } from 'semantic-ui-react'

function HomePage() {
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <h1 className='ui inverted stackable header'>
          <img src='/assets/logo.png' alt='logo' className='ui image massive' />
          <div className='content'>Reactivities</div>
        </h1>
        <h2>Do whatever you want to do</h2>
        <h3>Go ahead and <Link to='/activities' color='teal'>join us</Link></h3>
      </Container>
    </Segment>

  )
}

export default HomePage