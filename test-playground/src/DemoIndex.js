import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectors, actions } from 'pyrodux';
import MessageSender from './MessageSender';

class DemoIndex extends React.Component {
    componentDidMount() {
        this.props.loadMessages();
    }

    componentWillUnmount() {
        this.props.unloadMessages();
    }

    render() {
        return <div>
            <h2>Index</h2>
            <hr />
            <p>is User Logged in? -> {this.props.loggedIn.toString()}</p>
            <p>did auth run? -> {this.props.didAuthRun.toString()}</p>
            <p>user email? -> {this.props.userMail}</p>
            <hr />
            
            Messages (loading: {this.props.messagesLoading.toString()})
            <ul>
                {this.props.messages.map((m,i) =>
                    <li key={i}>
                        {moment(m.datetime).format()} - {m.text} (<a href="#" onClick={this.props.deleteMessage(m.id)}>delete</a>)
                    </li>
                )}
            </ul>

            <MessageSender />
        </div>;
    }
}

export default connect(
    state => ({
        loggedIn: selectors.isLoggedIn(state),
        didAuthRun: selectors.didAuthRun(state),
        userMail: selectors.userEmail(state, "(user is not logged in)"),
        messages: selectors.asArray("messages", state),
        messagesLoading: selectors.isLoading("messages", state),
    }),
    dispatch => ({
        loadMessages: () => dispatch(actions.data.retrieveCollection("messages")),
        unloadMessages: () => dispatch(actions.data.unloadCollectionOrQuery("messages")),
        deleteMessage: (id) => () => dispatch(actions.data.deleteItem("messages", id)),
    })
)(DemoIndex);
