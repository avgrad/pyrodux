import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectors, actions } from 'pyrodux';
import pyrodux from 'pyrodux';
import MessageSender from './MessageSender';

const singleDocQuery = (uid) => pyrodux.firestore().collection("user").doc(uid);

class DemoSubscribe extends React.Component {
    componentDidMount() {
        this.props.loadDocument(this.props.uid);
    }

    componentWillUnmount() {
        this.props.unloadDocument();
    }

    render() {
        return <div>
            <h2>Subscribe Single Document</h2>
            <hr />
            Document (loading: {this.props.documentLoading.toString()})
            <pre>{JSON.stringify(this.props.document, null, 4)}</pre>
        </div>;
    }
}

export default connect(
    state => ({
        document: selectors.asObject("singleDocSubscribe", state),
        documentLoading: selectors.isLoading("singleDocSubscribe", state),
        uid: selectors.userId(state)
    }),
    dispatch => ({
        loadDocument: (uid) => dispatch(actions.data.subscribeQuery("singleDocSubscribe", singleDocQuery(uid))),
        unloadDocument: () => dispatch(actions.data.unloadCollectionOrQuery("singleDocSubscribe"))
    })
)(DemoSubscribe);
