import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';

import { Activity } from '../models/Activity';

interface Props {
    openCreateForm: (activity?: Activity) => void;
}

function NavBar({ openCreateForm } : Props) {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }}/>
                    Reactivites
                </Menu.Item>
                <Menu.Item name="Activities"/>
                <Menu.Item>
                    <Button onClick={() => openCreateForm()} positive content="Create Activity"/>
                </Menu.Item>
            </Container>
        </Menu>
    );
}

export default NavBar;