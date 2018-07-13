import React from 'react';
import { reduxForm, Field } from 'redux-form';

class SingleDocForm extends React.Component {
    render() {
        const {
            handleSubmit,
            error
        } = this.props;

        return <form onSubmit={handleSubmit}>
            <label>
                someSetting
                <Field type="text" component="input" name="someSetting" />
            </label>
            <br />
            <label>
                otherSetting
                <Field type="text" component="input" name="otherSetting" />
            </label>
            <br />
            <br />
            {error}
            <br />
            <button type="submit">Save</button>
        </form>;
    }
}

export default reduxForm({
    form: "singleDoc"
})(SingleDocForm);
