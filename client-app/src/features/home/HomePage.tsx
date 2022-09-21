import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

function HomePage() {
  return (
    <Container style={{ marginTop: '5rem' }}>
      <div>HomePage</div>
      <h2>Go to
        <Link to={'/activities'}> Activities</Link>
      </h2>
    </Container>
  )
}

export default HomePage