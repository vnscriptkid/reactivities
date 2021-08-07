import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import { Activity } from '../models/Activity';

interface Props {
    openEditMode: (activity: Activity | undefined) => void;
}

function NavBar({ openEditMode } : Props) {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }}/>
                    Reactivites
                </Menu.Item>
                <Menu.Item name="Activities"/>
                <Menu.Item>
                    <Button onClick={() => openEditMode(undefined)} positive content="Create Activity"/>
                </Menu.Item>
            </Container>
        </Menu>
    );
}

export default NavBar;