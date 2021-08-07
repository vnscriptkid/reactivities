import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup, Card, Image } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';

import { useStore } from '../../../app/stores/store';

function ActivityDetails() {

    const {activityStore} = useStore();
    const { selectedActivity, loadActivity, initialLoading} = activityStore;

    const {id} = useParams<{ id: string }>();
    
    useEffect(() => {
        loadActivity(id);
    }, [loadActivity, id]);
    
    if (!selectedActivity || initialLoading) return <Loading />
    
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${selectedActivity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{selectedActivity.title}</Card.Header>
                <Card.Meta>
                    <span>{selectedActivity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedActivity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <ButtonGroup widths='2'>
                    <Button basic color='blue' content='Edit' />
                    <Button basic color='grey' content='Cancel' />
                </ButtonGroup>
            </Card.Content>
        </Card>
    );
}

export default observer(ActivityDetails);