import { Formik } from 'formik';
import { Button, Form, Header } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import * as Yup from 'yup';
import { useStore } from '../../app/stores/store';

function RegisterForm() {

    const {userStore} = useStore();

    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required').email('Invalid email'),
        password: Yup.string().required('Password is required'),
        displayName: Yup.string().required('Display name is required'),
        username: Yup.string().required('Username is required'),
    });
    
    return (
        <Formik 
            validationSchema={validationSchema} 
            initialValues={{ email: '', password: '', username: '', displayName: '', error: null }} 
            onSubmit={(values, {setErrors}) => userStore
                .register(values)
                .catch(error => setErrors({ error })) }
        >
            {({ handleSubmit, isValid, dirty, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign='center' />
                    <MyTextInput name="email" placeholder="Email"/>
                    <MyTextInput name="username" placeholder="Username"/>
                    <MyTextInput name="displayName" placeholder="Display Name"/>
                    <MyTextInput name="password" placeholder="Password" type="password"/>

                    {/*
                    TODO: Display validation errors
                     <ErrorMessage name='error' render={() => (
                        <ValidationErrors errors={errors.error} />
                    )} /> */}
                    
                    <Button 
                        loading={isSubmitting}
                        disabled={!isValid || !dirty || isSubmitting} 
                        positive content='Register' type='submit' fluid />
                </Form>
            )}
        </Formik>
    );
}

export default RegisterForm;