import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextAreaInput from '../../../app/common/form/MyTextAreaInput';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/CategoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';



export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { initialLoading, createActivity, updateActivity, loadActivity } = activityStore;
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    useEffect(() => {
        if (id) loadActivity(id)
            .then(activity => setActivity(new ActivityFormValues(activity)));
    }, [loadActivity, id]);

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required()
    });


    const hanldleFormSubmit = (activity: ActivityFormValues) => {
        if (!activity.id) {

            let newActivity = {
                ...activity,
                id: uuid()
            }

            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    if (initialLoading) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => hanldleFormSubmit(values)}>
                {({ handleSubmit, isSubmitting }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextAreaInput rows={3} name='description' placeholder='Description' />
                        <MySelectInput options={categoryOptions} name='category' placeholder='Category' />
                        <MyDateInput name='date' />
                        <MyTextInput name='city' placeholder='City' />
                        <MyTextInput name='venue' placeholder='Venue' />
                        <Button loading={isSubmitting} floated='right' positive type='submit' content='Submit' />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />

                    </Form>
                )}
            </Formik>
        </Segment>
    )
})
