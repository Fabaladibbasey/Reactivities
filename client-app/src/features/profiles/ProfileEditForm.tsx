import { Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Button, Header } from 'semantic-ui-react'
import MyTextAreaInput from '../../app/common/form/MyTextAreaInput'
import MyTextInput from '../../app/common/form/MyTextInput'
import * as Yup from 'yup'
import { Profile } from '../../app/models/profile'


interface Props {
    profile: Profile,
    updateProfile: (profile: Partial<Profile>) => void
}

function ProfileEditForm({ profile, updateProfile }: Props) {
    const [profileFormValues, setProfileFormValues] = useState({ displayName: '', bio: '' });


    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
    })

    useEffect(() => {
        setProfileFormValues(
            {
                displayName: profile.displayName,
                bio: profile.bio!
            })
    }, [profile])

    return (
        <Formik
            initialValues={profileFormValues}
            onSubmit={values => updateProfile(values)}
            validationSchema={validationSchema}
            enableReinitialize
        >
            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header sub color='teal' content='Basics' />
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextAreaInput name='bio' placeholder='Bio' rows={3} />
                    <Button
                        loading={isSubmitting}
                        disabled={isSubmitting || !dirty || !isValid}
                        floated='right'
                        positive
                        type='submit'
                        content='Update profile'
                    />
                </Form>
            )}
        </Formik>
    )
}

export default observer(ProfileEditForm)