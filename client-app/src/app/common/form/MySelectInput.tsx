import { useField } from 'formik';
import React from 'react'
import { Form, Label, Select } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    options: { key: string, text: string, value: string }[];
    label?: string;
}

const MyTextInput = ({ label, ...props }: Props) => {
    const [field, meta, helpers] = useField(props);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>
                {label}
            </label>
            <Select
                clearable
                options={props.options}
                value={field.value}
                onChange={(e, data) => helpers.setValue(data.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red' >{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
};

export default MyTextInput