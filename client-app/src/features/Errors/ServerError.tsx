import { observe } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Container, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/api/stores/store';

export default observer(function ServerError() {
    const { commonStore } = useStore();

    return (
        <Container >
            <Header as='h1' content='Server Error' />
            <Header sub as='h5' color='red' content={commonStore.error && commonStore.error.message} />
            {commonStore.error && commonStore.error.details &&

                <Segment >
                    <Header as='h4' content='Stack trace' color='teal' />
                    <code style={{ marginTop: 10 }}>{commonStore.error.details}</code>
                </Segment>
            }

        </Container>
    )
})