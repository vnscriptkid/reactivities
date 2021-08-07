import { Button, ButtonGroup, Card, Image } from 'semantic-ui-react';

import { Activity } from '../../../app/models/Activity';
import { useStore } from '../../../app/stores/store';

interface Props {
    activity: Activity;
}

function ActivityDetails({ activity } : Props) {

    const {activityStore} = useStore();
    const {openForm, unselectActivity} = activityStore;
    
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
                    <Button onClick={openForm} basic color='blue' content='Edit' />
                    <Button onClick={unselectActivity} basic color='grey' content='Cancel' />
                </ButtonGroup>
            </Card.Content>
        </Card>
    );
}

export default ActivityDetails;