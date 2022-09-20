import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react';

interface Props {
    onHandleOpenForm: () => void;
}


export default function NavBar({onHandleOpenForm} : Props) {
    return (
        <Menu inverted fixed='top'>
        <Container>
            <Menu.Item header>
            <img src='/assets/logo.png' alt='logo' style={{ marginRight: '10px' }} />
            Reactivities
            </Menu.Item>
            <Menu.Item name='Activities' to='/activities' />
            <Menu.Item>
            <Button positive content='Create Activity' onClick={onHandleOpenForm}/>
            </Menu.Item>
        </Container>
        </Menu>
    );
}