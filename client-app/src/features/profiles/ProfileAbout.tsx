import { observer } from 'mobx-react-lite';
import React, { useState } from 'react'
import { Button, Grid, Header, Tab } from 'semantic-ui-react'
import { useStore } from '../../app/api/stores/store';
import { Profile } from '../../app/models/profile';
import ProfileEditForm from './ProfileEditForm';

interface Props {
    profile: Profile
}

function ProfileAbout({ profile }: Props) {
    const { profileStore: { isCurrentUser, updateProfile } } = useStore();
    const [editMode, setEditMode] = useState(false);

    function handleUpdateProfile(editProfile: Partial<Profile>) {
        updateProfile(editProfile).then(() => setEditMode(false));
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile.displayName}`} />
                    {isCurrentUser && (
                        <Button
                            onClick={() => setEditMode(!editMode)}
                            floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ? (
                        <ProfileEditForm profile={profile} updateProfile={handleUpdateProfile} />
                    ) : (
                        <p>
                            {profile.bio}
                        </p>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileAbout)