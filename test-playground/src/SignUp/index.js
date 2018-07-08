import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'pyrodux';
import SignUpForm from './SignUpForm';

class SignUpPage extends React.Component {
    render() {
        return <SignUpForm onSubmit={this.props.handleSubmit} />;
    }
}

export default connect(
    state => ({
        // TODO
    }),
    dispatch => ({
        handleSubmit: (values) => dispatch(actions.auth.doSignUpWithEmailPassword(values.email, values.password))
    })
)(SignUpPage);
