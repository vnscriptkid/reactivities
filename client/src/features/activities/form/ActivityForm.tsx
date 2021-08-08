import {useState} from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Segment } from 'semantic-ui-react';

import { Activity } from '../../../app/models/Activity';
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Loading from '../../../app/layout/Loading';
import { v4 as uuid } from 'uuid';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';

function ActivityForm() {
    
    const { activityStore } = useStore();
    const { loading, initialLoading, createActivity, updateActivity, loadActivity } = activityStore;

    const initalState: Activity = {
        id: '',
        title: '',
        description: '',
        category: '',
        date: null,
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

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        category: Yup.string().required('Category is required'),
        date: Yup.string().required('Date is required'),
        city: Yup.string().required('City is required'),
        venue: Yup.string().required('Venue is required'),
    });

    return (
        <Segment clearing>
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => console.log(values)}>
                {({handleSubmit}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea rows={3} name='description' placeholder='Description' />
                        <MySelectInput options={categoryOptions} name='category' placeholder='Category' />
                        <MyDateInput 
                            placeholderText='Date'
                            name='date' 
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <MyTextInput name='city' placeholder='City' />
                        <MyTextInput name='venue' placeholder='Venue' />

                        <Button loading={loading} disabled={loading} floated='right' positive type='submit' content='Submit' />
                        <Button as={Link} to={id ? `/activities/${id}` : '/activities'} floated='right' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
}

export default observer(ActivityForm);