import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'pyrodux';

class LogoutButton extends React.Component {
    render() {
        return <a href="#" onClick={this.props.handleClick}>Logout</a>
    }
}

export default connect(
    null,
    dispatch => ({
        handleClick: (e) => {
            e.preventDefault();
            dispatch(actions.auth.doLogout());
        }
    })
)(LogoutButton);
