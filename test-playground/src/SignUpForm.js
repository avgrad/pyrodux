import React from 'react';
import { reduxForm, Field } from 'redux-form';

const validate = (values) => {
    const errors = {};

    if(values.password && values.password === values.confirmpassword) {
        errors.password = "passwords are not identical";
        errors.confirmpassword = errors.password;
    }

    return errors;
}

class SignUpForm extends React.Component {
    render() {
        const {
            handleSubmit
        } = this.props;
        return <form onSubmit={handleSubmit}>
            <h2>SignUp</h2>
            <hr />
            <label>
                E-Mail
                <Field name="email" component="input" type="email" />
            </label>
            <br />
            <label>
                Password
                <Field name="password" component="input" type="password" />
            </label>
            <br />
            <label>
                ConfirmPassword
                <Field name="confirmpassword" component="input" type="password" />
            </label>
            <br />
            <button type="submit">Sign Up</button>
        </form>;
    }
}

export default reduxForm({
    form: "signup"
})(SignUpForm);
