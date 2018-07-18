import React from 'react';
import { connect } from 'react-redux';
import SingleDocForm from './Form';
import pyrodux, { selectors, actions } from 'pyrodux';

const singleDocQuery = (uid) => pyrodux.firestore().collection("user").doc(uid);

class SingleDocPage extends React.Component {
    componentDidMount() {
        this.props.loadData(this.props.uid);
    }

    componentWillUnmount() {
        this.props.unloadData();
    }

    render() {
        return <div>
            <h2>Single Document Query</h2>
            <hr />
            <p>
                isLoading: {this.props.isLoading.toString()}
            </p>
            {!this.props.isLoading &&
                <SingleDocForm initialValues={this.props.initialValues} onSubmit={this.props.handleSubmit} />
            }
        </div>;
    }
}

export default connect(
    state => ({
        isLoading: selectors.isLoading("singleDoc", state),
        initialValues: selectors.asObject("singleDoc", state), // someSetting // otherSetting
        uid: selectors.userId(state)
    }),
    dispatch => ({
        loadData: (uid) => dispatch(actions.data.retrieveQuery("singleDoc", singleDocQuery(uid))),
        handleSubmit: (values) => dispatch(actions.data.updateItemDoc("singleDoc", values)),
        unloadData: () => dispatch(actions.data.unloadCollectionOrQuery("singleDoc"))
    })
)(SingleDocPage);
