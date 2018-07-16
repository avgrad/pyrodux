import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectors, actions } from 'pyrodux';
import pyrodux from 'pyrodux';
import MessageSender from './MessageSender';

const singleDocQuery = pyrodux.firestore().collection("user").doc("lqkkwwdq4Gc4WMUUcKQa1GcWSI63");

class DemoSubscribe extends React.Component {
    componentDidMount() {
        this.props.loadDocument();
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
    }),
    dispatch => ({
        loadDocument: () => dispatch(actions.data.subscribeQuery("singleDocSubscribe", singleDocQuery)),
        unloadDocument: () => dispatch(actions.data.unloadCollectionOrQuery("singleDocSubscribe"))
    })
)(DemoSubscribe);
