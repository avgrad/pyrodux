import React from 'react';
import { reduxForm, Field } from 'redux-form';

class SignUpForm extends React.Component {
    render() {
        const {
            handleSubmit
        } = this.props;
        return <form onSubmit={handleSubmit}>
            <h2>SignUp</h2>
            <hr />
        </form>;
    }
}

export default reduxForm({
    form: "signup"
})(SignUpForm);
