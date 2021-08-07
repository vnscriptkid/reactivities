import React from 'react';
import { Button, ButtonGroup, Card, Image } from 'semantic-ui-react';
import { Activity } from '../../../models/Activity';

interface Props {
    activity: Activity;
    cancelSelectActivity: () => void;
    openEditMode: (activity: Activity | undefined) => void;
}

function ActivityDetails({ activity, cancelSelectActivity, openEditMode } : Props) {
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <ButtonGroup widths='2'>
                    <Button onClick={() => openEditMode(activity)} basic color='blue' content='Edit' />
                    <Button onClick={cancelSelectActivity} basic color='grey' content='Cancel' />
                </ButtonGroup>
            </Card.Content>
        </Card>
    );
}

export default ActivityDetails;