import React from 'react';
import { connect } from 'react-redux';
import { selectors } from 'pyrodux';

class DemoIndex extends React.Component {
    render() {
        return <div>
            <h2>Index</h2>
            <hr />
            <p>is User Logged in? -> {this.props.loggedIn.toString()}</p>
            <p>did auth run? -> {this.props.didAuthRun.toString()}</p>
            <p>user email? -> {this.props.userMail}</p>
        </div>;
    }
}

export default connect(
    state => ({
        loggedIn: selectors.isLoggedIn(state),
        didAuthRun: selectors.didAuthRun(state),
        userMail: selectors.userEmail(state, "(user is not logged in)")
    }),
    dispatch => ({
        // TODO
    })
)(DemoIndex);
