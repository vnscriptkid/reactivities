import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Card, Image } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';

import { useStore } from '../../../app/stores/store';

function ActivityDetails() {

    const {activityStore} = useStore();
    const { selectedActivity: activity, loadActivity, initialLoading} = activityStore;

    const {id} = useParams<{ id: string }>();
    
    useEffect(() => {
        loadActivity(id);
    }, [loadActivity, id]);
    
    if (!activity || initialLoading) return <Loading />
    
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
                    <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content='Edit' />
                    <Button as={Link} to='/activities' basic color='grey' content='Cancel' />
                </ButtonGroup>
            </Card.Content>
        </Card>
    );
}

export default observer(ActivityDetails);