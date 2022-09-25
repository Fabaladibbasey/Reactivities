import { useField } from 'formik';
import React from 'react'
import { Form, Label } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    label?: string;
}

const MyTextInput = ({ label, ...props }: Props) => {
    const [field, meta, helpers] = useField(props);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>
                {label}
                <input {...field} {...props} />
            </label>
            {meta.touched && meta.error ? (
                <Label basic color='red' >{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
};

export default MyTextInput