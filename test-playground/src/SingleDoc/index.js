import React from 'react';
import { connect } from 'react-redux';
import SingleDocForm from './Form';
import pyrodux, { selectors, actions } from 'pyrodux';

const singleDocQuery = pyrodux.firestore().collection("user").doc("lqkkwwdq4Gc4WMUUcKQa1GcWSI63");
console.log(singleDocQuery);

class SingleDocPage extends React.Component {
    componentDidMount() {
        this.props.loadData();
    }

    render() {
        return <div>
            <p>
                isLoading: {this.props.isLoading}
            </p>
            <SingleDocForm initialValues={this.props.initialValues} onSubmit={this.props.handleSubmit} />
        </div>;
    }
}

export default connect(
    state => ({
        isLoading: selectors.isLoading("singleDoc", state).toString(),
        initialValues: selectors.asObject("singleDoc", state) // someSetting // otherSetting
    }),
    dispatch => ({
        loadData: () => console.log("// TODO load data"),
        handleSubmit: (values) => console.log(values),
        unloadData: () => dispatch(actions.data.unloadCollectionOrQuery("singleDoc"))
    })
)(SingleDocPage);
