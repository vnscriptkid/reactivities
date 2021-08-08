import { Formik } from 'formik';
import { Button, Form } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import * as Yup from 'yup';

function LoginForm() {

    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required').email('Invalid email'),
        password: Yup.string().required('Password is required'),
    });
    
    return (
        <Formik validationSchema={validationSchema} initialValues={{ email: '', password: '' }} onSubmit={values => console.log(values)}>
            {({ handleSubmit, isValid, touched, isSubmitting }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name="email" placeholder="Email"/>
                    <MyTextInput name="password" placeholder="Password" type="password"/>
                    <Button disabled={!isValid || !touched || isSubmitting} positive content='Login' type='submit' fluid />
                </Form>
            )}
        </Formik>
    );
}

export default LoginForm;