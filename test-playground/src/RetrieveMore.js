import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import pyrodux, { selectors, actions } from 'pyrodux';

const query1 = pyrodux.firestore().collection("messages").orderBy("datetime", "asc").limit(1);
const query2 = pyrodux.firestore().collection("messages").orderBy("datetime", "desc").limit(1);
const query3 = pyrodux.firestore().collection("messages");

class RetrieveMore extends React.Component {
    componentWillUnmount() {
        this.props.unloadMessages();
    }

    render() {
        return <div>
            <h2>Retrieve More for Query</h2>
            <hr />
            Messages (loading: {this.props.messagesLoading.toString()})
            <br />
            <button onClick={this.props.loadFirstMessage}>Load first Message</button>
            <button onClick={this.props.loadLastMessage}>Load last Message</button>
            <button onClick={this.props.loadAllMessages}>Load all Messages</button>
            <br />
            <ul>
                {this.props.messages.map((m,i) =>
                    <li key={i}>
                        {moment(m.datetime).format()} - {m.text}
                    </li>
                )}
            </ul>
        </div>;
    }
}

export default connect(
    state => ({
        messages: selectors.asArray("messages", state),
        messagesLoading: selectors.isLoading("messages", state),
    }),
    dispatch => ({
        loadFirstMessage: () => dispatch(actions.data.retrieveQuery("messages", query1)),
        loadLastMessage: () => dispatch(actions.data.retrieveQuery("messages", query2)),
        loadAllMessages: () => dispatch(actions.data.retrieveQuery("messages", query3)),
        unloadMessages: () => dispatch(actions.data.unloadCollectionOrQuery("messages"))
    })
)(RetrieveMore);
