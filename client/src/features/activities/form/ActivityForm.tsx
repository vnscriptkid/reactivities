import React, {useState} from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Form, Segment } from 'semantic-ui-react';

import { Activity } from '../../../app/models/Activity';
import { useStore } from '../../../app/stores/store';

function ActivityForm() {
    
    const { activityStore } = useStore();
    const { closeForm, selectedActivity, createActivity, updateActivity, loading } = activityStore;

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
        setActivity({ ...activity, [name]: value });
    }

    const handleSubmit = () => {
        if (activity.id) updateActivity(activity);
        else createActivity(activity);
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input value={activity.title} onChange={onChangeInput} name='title' placeholder='Title' />
                <Form.TextArea value={activity.description} onChange={onChangeInput} name='description' placeholder='Description' />
                <Form.Input value={activity.category} onChange={onChangeInput} name='category' placeholder='Category' />
                <Form.Input type='date' value={activity.date} onChange={onChangeInput} name='date' placeholder='Date' />
                <Form.Input value={activity.city} onChange={onChangeInput} name='city' placeholder='City' />
                <Form.Input value={activity.venue} onChange={onChangeInput} name='venue' placeholder='Venue' />

                <Button loading={loading} disabled={loading} floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='submit' content='Cancel' />
            </Form>
        </Segment>
    );
}

export default observer(ActivityForm);