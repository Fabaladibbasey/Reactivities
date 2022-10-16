import React from 'react'
import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Menu, MenuItem, Image, Dropdown } from 'semantic-ui-react';
import { useStore } from '../api/stores/store';

export default observer(function NavBar() {
    const { userStore: { user, logout } } = useStore();
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

                <MenuItem position='right'>
                    <Image src={user && user.image || '/assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={`${user && user.displayName}`}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profiles/${user && user.userName}`} text='My Profile' icon='user' />
                            <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                        </Dropdown.Menu>
                    </Dropdown>
                </MenuItem>

            </Container>
        </Menu>
    );
})