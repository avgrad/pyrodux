import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { auth as firebaseAuth } from './firebase';
import pyrodux from 'pyrodux';
import DemoIndex from './DemoIndex';
import DemoSubscribe from './DemoSubscribe';
import LoginPage from './Login';
import SignUpPage from './SignUp';
import SingleDocPage from './SingleDoc';
import LogoutButton from './LogoutButton';
import UserState from './UserState';

const rootReducer = combineReducers({
  pyrodux: pyrodux.getReducer('pyrodux'),
  form: formReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(reduxThunk)
);

firebaseAuth.onAuthStateChanged(pyrodux.createOnAuthChangedHandler(store));

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <h1>pyrodux test playground application</h1>
            <nav>
              <Link to="/">Index</Link>
              <Link to="/singledoc">Single Doc</Link>
              <Link to="/subscribe">Subscribe Collection</Link>
              <span>||| </span>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <LogoutButton />
            </nav>
            <UserState />
            <hr />
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/signup" component={SignUpPage} />
              <Route exact path="/singledoc" component={SingleDocPage} />
              <Route exact path="/subscribe" component={DemoSubscribe} />
              <Route exact path="/" component={DemoIndex} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
