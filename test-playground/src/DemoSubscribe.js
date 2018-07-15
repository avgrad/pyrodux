import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectors, actions } from 'pyrodux';
import MessageSender from './MessageSender';

class DemoSubscribe extends React.Component {
    componentDidMount() {
        this.props.loadMessages();
    }

    componentWillUnmount() {
        this.props.unloadMessages();
    }

    render() {
        return <div>
            <h2>Subscribe Collection</h2>
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
        messages: selectors.asArray("messages", state),
        messagesLoading: selectors.isLoading("messages", state),
    }),
    dispatch => ({
        loadMessages: () => dispatch(actions.data.subscribeCollection("messages")),
        unloadMessages: () => dispatch(actions.data.unloadCollectionOrQuery("messages")),
        deleteMessage: (id) => () => dispatch(actions.data.deleteItem("messages", id)),
    })
)(DemoSubscribe);
