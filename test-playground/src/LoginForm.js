import React from 'react';
import { reduxForm, Field } from 'redux-form';

class LoginForm extends React.Component {
    render() {
        const {
            handleSubmit
        } = this.props;
        return <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <hr />
        </form>;
    }
}

export default reduxForm({
    form: "login"
})(LoginForm);