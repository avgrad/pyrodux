import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import pyrodux from 'pyrodux';
import DemoIndex from './DemoIndex';
import LoginPage from './Login';
import SignUpPage from './SignUp';

const rootReducer = combineReducers({
  pyrodux: pyrodux.getReducer('pyrodux'),
  form: formReducer
});

const store = createStore(rootReducer);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <h1>pyrodux test playground application</h1>
            <nav>
              <Link to="/">Index</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </nav>
            <hr />
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/signup" component={SignUpPage} />
              <Route exact path="/" component={DemoIndex} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
