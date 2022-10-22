import { observer } from 'mobx-react-lite'
import React from 'react'
import { Tab } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import ProfileAbout from './ProfileAbout'
import ProfileFollowings from './ProfileFollowings'
import ProfilePhotos from './ProfilePhotos'

interface Props {
    profile: Profile
}

function ProfileContent({ profile }: Props) {
    const panes = [
        { menuItem: 'About', render: () => <ProfileAbout profile={profile} /> },
        { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
        { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
        { menuItem: 'Followers', render: () => <ProfileFollowings predicate='followers' /> },
        { menuItem: 'Following', render: () => <ProfileFollowings predicate='following' /> },
    ]

    return (
        <Tab menu={{ fluid: true, vertical: true }} menuPosition='right' panes={panes} />
    )
}

export default observer(ProfileContent)