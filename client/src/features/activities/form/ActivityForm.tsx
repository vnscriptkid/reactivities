import {useState} from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Segment } from 'semantic-ui-react';

import { Activity } from '../../../app/models/Activity';
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Loading from '../../../app/layout/Loading';
import { v4 as uuid } from 'uuid';
import { Field, Form, Formik } from 'formik';

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <Formik enableReinitialize initialValues={activity} onSubmit={values => console.log(values)}>
                {({handleSubmit}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Field name='title' placeholder='Title' />
                        <Field name='description' placeholder='Description' />
                        <Field name='category' placeholder='Category' />
                        <Field type='date' name='date' placeholder='Date' />
                        <Field name='city' placeholder='City' />
                        <Field name='venue' placeholder='Venue' />

                        <Button loading={loading} disabled={loading} floated='right' positive type='submit' content='Submit' />
                        <Button as={Link} to={id ? `/activities/${id}` : '/activities'} floated='right' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
}

export default observer(ActivityForm);