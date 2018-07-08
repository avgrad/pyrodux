import React from 'react';
import { reduxForm, Field } from 'redux-form';

class LoginForm extends React.Component {
    render() {
        const {
            handleSubmit,
            error
        } = this.props;
        return <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <hr />
            <label>
                E-Mail
                <Field name="email" label="E-Mail" component="input" type="email" />
            </label>
            <br />
            <label>
                Password
                <Field name="password" label="Password" component="input" type="password" />
            </label>
            <br />
            {error}
            <br />
            <button type="submit">Login</button>
        </form>;
    }
}

export default reduxForm({
    form: "login"
})(LoginForm);
