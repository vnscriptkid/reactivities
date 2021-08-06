import React from 'react';
import { Button, Divider, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../models/Activity';

interface Props {
    activities: Activity[];
    handleActivitySelected: (activity: Activity) => void;
}

function ActivityList({activities, handleActivitySelected} : Props) {
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
                            <Button onClick={() => handleActivitySelected(activity)} 
                                floated='right' content='View' color='blue'/>
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