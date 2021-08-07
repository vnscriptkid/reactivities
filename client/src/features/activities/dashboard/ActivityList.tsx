import React, { SyntheticEvent } from 'react';
import { useState } from 'react';
import { Button, Divider, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/Activity';

interface Props {
    activities: Activity[];
    selectActivity: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

function ActivityList({activities, selectActivity, deleteActivity, submitting} : Props) {

    const [targetId, setTargetId] = useState('');
    
    function handleDeleteActivity(event: SyntheticEvent<HTMLButtonElement>) {
        setTargetId(event.currentTarget.name);
        deleteActivity(event.currentTarget.name)
    }
    
    return (
        <Segment>
            <Item.Group divided>
                {activities.map((activity) => (
                    <Item.Content key={activity.id}>
                        <Item.Header as='a'>{activity.title}</Item.Header>
                        <Item.Meta>{activity.date}</Item.Meta>
                        <Item.Description>
                            <div>{activity.description}</div>
                            <div>{activity.city}, {activity.venue}</div>
                        </Item.Description>
                        <Item.Extra>
                            <Button onClick={() => selectActivity(activity)} 
                                floated='right' content='View' color='blue'/>
                            <Button 
                                name={activity.id} 
                                loading={submitting && targetId === activity.id} 
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

export default ActivityList;