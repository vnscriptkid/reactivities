import React, { SyntheticEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Divider, Item, Label, Segment } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';

function ActivityList() {

    const { activityStore } = useStore();
    const { activitiesByDate, loading, selectActivity, deleteActivity } = activityStore;
    
    const [targetId, setTargetId] = useState('');
    
    function handleDeleteActivity(event: SyntheticEvent<HTMLButtonElement>) {
        setTargetId(event.currentTarget.name);
        
        deleteActivity(event.currentTarget.name)
    }
    
    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map((activity) => (
                    <Item.Content key={activity.id}>
                        <Item.Header as='a'>{activity.title}</Item.Header>
                        <Item.Meta>{activity.date}</Item.Meta>
                        <Item.Description>
                            <div>{activity.description}</div>
                            <div>{activity.city}, {activity.venue}</div>
                        </Item.Description>
                        <Item.Extra>
                            <Button onClick={() => selectActivity(activity.id)} 
                                floated='right' content='View' color='blue'/>
                            <Button 
                                name={activity.id} 
                                loading={loading && targetId === activity.id} 
                                disabled={loading && targetId === activity.id}
                                onClick={handleDeleteActivity} 
                                floated='right' content='Delete' color='red'/>
                            <Label basic content={activity.category}/>
                        </Item.Extra>
                        <Divider />
                    </Item.Content>
                ))}
            </Item.Group>
        </Segment>
    );
}

export default observer(ActivityList);