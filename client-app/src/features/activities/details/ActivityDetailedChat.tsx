import { Field, FieldProps, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Header, Comment, Button, Loader } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/store'
import MyTextAreaInput from '../../../app/common/form/MyTextAreaInput'
import * as Yup from 'yup'
import { text } from 'stream/consumers'
import { formatDistanceToNow } from 'date-fns'

interface Props {
    activityId: string
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
    const { commentStore } = useStore();

    useEffect(() => {
        if (activityId) {
            commentStore.createHubConnection(activityId);
        }
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore, activityId])


    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Formik
                    initialValues={{ body: '', activityId }}
                    onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}
                    validationSchema={Yup.object({
                        body: Yup.string().required()
                    })}
                >
                    {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                        <Form className='ui form'>
                            <Field name='body'>
                                {(props: FieldProps) => (
                                    <div style={{ position: 'relative' }}>
                                        <Loader active={isSubmitting} />
                                        <textarea
                                            rows={2}
                                            {...props.field}
                                            onKeyPress={e => {
                                                if (e.key === 'Enter' && e.shiftKey) {
                                                    return;
                                                }
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    isValid && dirty && handleSubmit();
                                                }
                                            }}
                                            placeholder='Add your comment, (Enter to submit, Shift + Enter for new line)'
                                        />
                                    </div>
                                )}

                            </Field>
                        </Form>
                    )}

                </Formik>
                <Comment.Group>
                    {commentStore.comments.map((comment) => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.userName}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago </div>
                                </Comment.Metadata>
                                <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}

                </Comment.Group>
            </Segment>
        </>

    )
})
