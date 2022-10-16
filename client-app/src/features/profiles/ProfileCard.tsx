import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Icon, Image } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'

interface Props {
    Profile: Profile
}

function ProfileCard({ Profile }: Props) {
    return (
        <Card>
            <Image src={Profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{Profile.displayName}</Card.Header>
                <Card.Meta>
                    <span>
                        {
                            (Profile.bio && Profile.bio.length > 30) ? Profile.bio.substring(0, 30) : Profile.bio}
                        ...
                    </span>
                </Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <Button as={Link} to={`/profiles/${Profile.userName}`} basic color='blue' content='View Profile' />
                <Icon name='user' />
                20 followers
            </Card.Content>

        </Card>
    )
}

export default observer(ProfileCard)