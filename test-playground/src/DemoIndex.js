import React from 'react';
import { connect } from 'react-redux';
import selectors from 'pyrodux';

class DemoIndex extends React.Component {
    render() {
        return <div>
            Index
        </div>;
    }
}

export default connect(
    state => ({
        // TODO
    }),
    dispatch => ({
        // TODO
    })
)(DemoIndex);
