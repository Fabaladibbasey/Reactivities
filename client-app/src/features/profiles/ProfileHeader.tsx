import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Divider, Grid, Item, ItemGroup, Reveal, Segment, Statistic, StatisticGroup } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'


interface Props {
    profile: Profile
}

function ProfileHeader({ profile }: Props) {

    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <ItemGroup>
                        <Item>
                            <Item.Image avatar size='small' circular src={profile.image || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header as='h1'>{profile.displayName}</Item.Header>
                            </Item.Content>
                        </Item>
                    </ItemGroup>
                </Grid.Column>
                <Grid.Column width={4}>
                    <StatisticGroup widths={2}>
                        <Statistic label='Followers' value='5' />
                        <Statistic label='Following' value='42' />
                    </StatisticGroup>
                    <Divider />
                    <Reveal animated='move'>
                        <Reveal.Content visible style={{ width: '100%' }}>
                            <Button fluid color='teal' content='Following' />
                        </Reveal.Content>
                        <Reveal.Content hidden style={{ width: '100%' }}>
                            <Button fluid basic color={true ? 'red' : 'green'} content={true ? 'Unfollow' : 'Follow'} />
                        </Reveal.Content>
                    </Reveal>
                </Grid.Column>
            </Grid>
        </Segment>
    )
}

export default observer(ProfileHeader)