import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'pyrodux';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {
    render() {
        return <LoginForm onSubmit={this.props.handleSubmit} />;
    }
}

export default connect(
    state => ({
        // TODO
    }),
    dispatch => ({
        handleSubmit: (values) => actions.auth.doLoginWithEmailPassword(values.email, values.password)
    })
)(LoginPage);
