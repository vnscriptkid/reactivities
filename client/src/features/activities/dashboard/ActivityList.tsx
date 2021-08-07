import React from 'react';
import { Button, Divider, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../models/Activity';

interface Props {
    activities: Activity[];
    selectActivity: (activity: Activity) => void;
    handleDeleteActivity: (id: string) => void;
}

function ActivityList({activities, selectActivity, handleDeleteActivity} : Props) {
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
                                <Button onClick={() => handleDeleteActivity(activity.id)} 
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