import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { actions } from 'pyrodux';
import { reduxForm, Field } from 'redux-form';

class MessageSenderForm extends React.Component {
    render() {
        const {
            handleSubmit,
            error
        } = this.props;
        return <form onSubmit={handleSubmit}>
            <Field component="input" type="text" name="message" />
            <button type="submit">Send</button>
            <br />
            {error}
        </form>
    }
}

MessageSenderForm = reduxForm({
    form: "sendMessage"
})(MessageSenderForm);

class MessageSender extends React.Component {
    render() {
        const {
            handleMessageSubmit
        } = this.props;
        return <MessageSenderForm onSubmit={handleMessageSubmit} />
    }
}

export default connect(
    null,
    dispatch => ({
        handleMessageSubmit: values => dispatch(actions.data.addItem("messages", { text: values.message, datetime: moment().format()}))
    })
)(MessageSender);