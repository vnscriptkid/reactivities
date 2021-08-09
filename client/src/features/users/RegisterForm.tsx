import { ErrorMessage, Formik } from 'formik';
import { Button, Form, Header, Label } from 'semantic-ui-react';
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
                .catch(e => console.log(e)) }
        >
            {({ handleSubmit, isValid, dirty, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Register to Reactivities' color='teal' textAlign='center' />
                    <MyTextInput name="email" placeholder="Email"/>
                    <MyTextInput name="username" placeholder="Username"/>
                    <MyTextInput name="displayName" placeholder="Display Name"/>
                    <MyTextInput name="password" placeholder="Password" type="password"/>
                    <ErrorMessage  name='error' render={() => (
                        <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />
                    )} />
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