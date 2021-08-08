import { useField } from "formik";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import { Form, Label } from "semantic-ui-react";

function MyDateInput(props: Partial<ReactDatePickerProps>) {
    const [ field, meta, helpers ] = useField(props.name!);
    
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <ReactDatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
            />
            {(meta.touched && meta.error) ? (
                <Label basic color='red' content={meta.error} />
            ) : null}
        </Form.Field>
    );
}

export default MyDateInput;