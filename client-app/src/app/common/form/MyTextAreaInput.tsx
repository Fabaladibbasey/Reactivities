import { useField } from 'formik';
import React from 'react'
import { Form, Label } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    rows: number;
    label?: string;
}

const MyTextAreaInput = ({ label, ...props }: Props) => {
    const [field, meta, helpers] = useField(props);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>
                {label}
                <textarea {...field} {...props} />
            </label>
            {meta.touched && meta.error ? (
                <Label basic color='red' >{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
};

export default MyTextAreaInput