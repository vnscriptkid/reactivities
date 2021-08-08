import {useState} from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Form, Segment } from 'semantic-ui-react';

import { Activity } from '../../../app/models/Activity';
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Loading from '../../../app/layout/Loading';
import { v4 as uuid } from 'uuid';

function ActivityForm() {
    
    const { activityStore } = useStore();
    const { loading, initialLoading, createActivity, updateActivity, loadActivity } = activityStore;

    const initalState: Activity = {
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: ''
    };

    const [activity, setActivity] = useState(initalState);

    const {id} = useParams<{ id: string }>();

    const history = useHistory();

    useEffect(() => {
        if (id) {
            loadActivity(id).then(a => {
                if (a) setActivity(a);
            });
        }
    }, [id, loadActivity]);

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

    const handleSubmit = () => {
        if (activity.id) {
            updateActivity(activity)
                .then(() => history.push(`/activities/${activity.id}`));
        } else {
            const id = uuid();
            createActivity({ ...activity, id })
                .then(() => history.push(`/activities/${id}`));
        }
    }

    if (initialLoading) return <Loading />

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
                <Button as={Link} to={id ? `/activities/${id}` : '/activities'} floated='right' content='Cancel' />
            </Form>
        </Segment>
    );
}

export default observer(ActivityForm);