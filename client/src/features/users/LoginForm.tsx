import { ErrorMessage, Formik } from 'formik';
import { Button, Form, Header, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import * as Yup from 'yup';
import { useStore } from '../../app/stores/store';

function LoginForm() {

    const {userStore} = useStore();

    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required').email('Invalid email'),
        password: Yup.string().required('Password is required'),
    });
    
    return (
        <Formik 
            validationSchema={validationSchema} 
            initialValues={{ email: '', password: '', error: null }} 
            onSubmit={(values, {setErrors}) => userStore
                .login(values)
                .catch(e => setErrors({ error: 'Invalid email or password' })) }
        >
            {({ handleSubmit, isValid, touched, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center' />
                    <MyTextInput name="email" placeholder="Email"/>
                    <MyTextInput name="password" placeholder="Password" type="password"/>
                    <ErrorMessage  name='error' render={() => (
                        <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />
                    )} />
                    <Button 
                        loading={isSubmitting}
                        disabled={!isValid || !touched || isSubmitting} 
                        positive content='Login' type='submit' fluid />
                </Form>
            )}
        </Formik>
    );
}

export default LoginForm;