import { Field, FieldProps, Formik } from 'formik';
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react';
import {Segment, Header, Comment, Form, Button, Loader} from 'semantic-ui-react'
import MyTextArea from '../../../app/common/form/MyTextArea';
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup';

interface Props {
    activityId: string;
}

function ActivityDetailedChat({activityId} : Props) {

    const {commentStore: { comments, clearComments, createHubConnection, addComment }} = useStore();

    useEffect(() => {
        if (activityId) {
            createHubConnection(activityId);
        }

        return () => clearComments()
    }, [ activityId, createHubConnection, clearComments ]);
    
    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>

                    {comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'}/>
                            <Comment.Content>
                                <Comment.Author as='a'>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{comment.createdAt}</div>
                                </Comment.Metadata>
                                <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}

                    <Formik 
                        onSubmit={(values, { resetForm }) => 
                            addComment(values).then(() => resetForm())}
                        initialValues={{ body: '' }}
                    >
                        {({ isSubmitting, isValid, handleSubmit }) => (
                            <Form className='ui form'>
                                <Field name='body'>
                                    {(props: FieldProps) => (
                                        <div>
                                            <Loader active={isSubmitting}/>
                                            <textarea 
                                                placeholder='Enter your comment (Enter to submit, Shift + Enter for new line)'
                                                rows={2}
                                                {...props.field}
                                                onKeyPress={e => {
                                                    if (e.key === 'Enter' && e.shiftKey) return;
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        isValid && handleSubmit();
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>

                </Comment.Group>
            </Segment>
        </>

    )
}

export default observer(ActivityDetailedChat);