import React from 'react';
import { useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../models/Activity';

interface Props {
    selectedActivity?: Activity;
    cancelEditMode: () => void;
    createOrUpdate: (activity: Activity) => void;
}

function ActivityForm({ cancelEditMode, selectedActivity, createOrUpdate } : Props) {

    const initalState: Activity = selectedActivity ?? {
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: ''
    };

    const [activity, setActivity] = useState(initalState);

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value })
    }

    return (
        <Segment clearing>
            <Form onSubmit={() => createOrUpdate(activity)}>
                <Form.Input value={activity.title} onChange={onChangeInput} name='title' placeholder='Title' />
                <Form.TextArea value={activity.description} onChange={onChangeInput} name='description' placeholder='Description' />
                <Form.Input value={activity.category} onChange={onChangeInput} name='category' placeholder='Category' />
                <Form.Input value={activity.date} onChange={onChangeInput} name='date' placeholder='Date' />
                <Form.Input value={activity.city} onChange={onChangeInput} name='city' placeholder='City' />
                <Form.Input value={activity.venue} onChange={onChangeInput} name='venue' placeholder='Venue' />
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={cancelEditMode} floated='right' type='submit' content='Cancel' />
            </Form>
        </Segment>
    );
}

export default ActivityForm;