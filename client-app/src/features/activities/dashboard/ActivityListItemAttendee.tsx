import { link } from 'fs'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { List, Image, Popup } from 'semantic-ui-react'
import { Profile } from '../../../app/models/profile'
import ProfileCard from '../../profiles/ProfileCard'

interface Props {
    attendees: Profile[]
}

function ActivityListItemAttendee({ attendees }: Props) {
    const styles = {
        borderColor: 'orange',
        borderWidth: 3
    }

    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.userName}
                    trigger={
                        <List.Item key={attendee.displayName} style={{ position: 'relative' }} as={Link} to={`/profiles/${attendee.userName}`}>
                            <Image
                                size='mini'
                                circular src={attendee.image || '/assets/user.png'}
                                bordered
                                style={attendee.following ? styles : null}
                            />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard Profile={attendee} />
                    </Popup.Content>
                </Popup>
            ))}

        </List>
    )
}

export default observer(ActivityListItemAttendee)