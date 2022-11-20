import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Card, Grid, Header, Tab } from 'semantic-ui-react'
import { useStore } from '../../app/api/stores/store'
import ProfileCard from './ProfileCard'

interface Props {
    predicate: string
}

function ProfileFollowings({ predicate }: Props) {
    const { profile, followings, loadFollowings, loading, clearFollowings } = useStore().profileStore
    useEffect(() => {
        loadFollowings(predicate)

        return () => {
            clearFollowings()
        }
    }, [profile, predicate, loadFollowings, clearFollowings])

    return (
        <Tab.Pane loading={loading}>
            <Grid>
                <Grid.Column width={16}>
                    <Header content={
                        predicate === 'followers' ? `People following ${profile!.displayName}` : `people ${profile!.displayName} is following`} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {
                            followings.map(profile => (
                                <ProfileCard key={profile.userName} Profile={profile} />
                            ))
                        }
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>

    )
}

export default observer(ProfileFollowings)