import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent } from 'react'
import { Button, Reveal } from 'semantic-ui-react'
import { useStore } from '../../app/api/stores/store'
import { Profile } from '../../app/models/profile'

interface Props {
    profile: Profile
}

function FollowButton({ profile }: Props) {
    const { loading, updateFollowing } = useStore().profileStore
    const { user } = useStore().userStore

    if (profile.userName === user!.userName) return null

    function handleFollow(e: SyntheticEvent, username: string) {
        if (profile.following) {
            updateFollowing(username, false)
        }
        else {
            updateFollowing(username, true)
        }
    }
    return (
        <>
            <Reveal animated='move'>
                <Reveal.Content visible style={{ width: '100%' }}>
                    <Button fluid color='teal' content={profile.following ? 'Following' : 'not following'} />
                </Reveal.Content>
                <Reveal.Content hidden style={{ width: '100%' }}>
                    <Button
                        fluid basic color={profile.following ? 'red' : 'green'} content={profile.following ? 'Unfollow' : 'Follow'}
                        loading={loading}
                        onClick={(e) => handleFollow(e, profile.userName)}
                        disabled={loading}
                    />
                </Reveal.Content>
            </Reveal>
        </>
    )
}

export default observer(FollowButton)