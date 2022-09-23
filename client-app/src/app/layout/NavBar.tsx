import React from 'react'
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../api/stores/store';

export default observer(function NavBar() {
    const { activityStore } = useStore();
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' exact header>
                    <img src='/assets/logo.png' alt='logo' style={{ marginRight: '10px' }} />
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' as={NavLink} to='/activities' />
                <Menu.Item name='Errors' as={NavLink} to='/errors' />
                <Menu.Item>
                    <Button positive content='Create Activity' as={NavLink} to='/createActivity' />
                </Menu.Item>

            </Container>
        </Menu>
    );
})