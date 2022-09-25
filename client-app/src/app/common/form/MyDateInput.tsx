import { useField } from 'formik';
import React from 'react'
import { Form, Label } from 'semantic-ui-react';
import DatePicker, { ReactDatePickerProps } from "react-datepicker";

const MyDateInput = ({ ...props }: Partial<ReactDatePickerProps>) => {
    const [field, meta, helpers] = useField(props.name!);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={(date) => helpers.setValue(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText='Select Date'
            />
            {meta.touched && meta.error ? (
                <Label basic color='red' >{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
};

export default MyDateInput