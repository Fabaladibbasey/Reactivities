import { ErrorMessage, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Header, Label } from 'semantic-ui-react'
import { useStore } from '../../app/api/stores/store'
import MyTextInput from '../../app/common/form/MyTextInput'

function LoginForm() {
    const { userStore } = useStore();
    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.login(values)
                .catch(error => setErrors({ error: 'Invalid email or password' }))}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit}>
                    <Header as='h2' content='LOGIN TO REACTIVITIES' color='teal' textAlign='center' />
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage name='error' render={() =>
                        <Label style={{ marginBottom: '10px' }} basic color='red' content={errors.error} />
                    } />
                    <Button loading={isSubmitting} positive content='Login' type='submit' fluid />
                </Form>


            )}
        </Formik>
    )
}

export default observer(LoginForm)