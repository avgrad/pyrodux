import React from 'react';
import { connect } from 'react-redux';
import SingleDocForm from './Form';
import pyrodux, { selectors, actions } from 'pyrodux';

const singleDocQuery = pyrodux.firestore().collection("user").doc("lqkkwwdq4Gc4WMUUcKQa1GcWSI63");

class SingleDocPage extends React.Component {
    componentDidMount() {
        this.props.loadData();
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
        initialValues: selectors.asObject("singleDoc", state) // someSetting // otherSetting
    }),
    dispatch => ({
        loadData: () => dispatch(actions.data.retrieveQuery("singleDoc", singleDocQuery)),
        handleSubmit: (values) => dispatch(actions.data.updateItemDoc("singleDoc", values)),
        unloadData: () => dispatch(actions.data.unloadCollectionOrQuery("singleDoc"))
    })
)(SingleDocPage);
