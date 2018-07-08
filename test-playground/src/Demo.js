import React from 'react';
import { connect } from 'react-redux';
import selectors from 'pyrodux';

class Demo extends React.Component {
    render() {
        return <div>
            xyz
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
)(Demo);
