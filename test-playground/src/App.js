import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import pyrodux from 'pyrodux';
import Demo from './Demo';

const rootReducer = combineReducers({
  pyrodux: pyrodux.getReducer('pyrodux')
});

const store = createStore(rootReducer);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <h1>pyrodux test playground application</h1>
          <hr />
          <Demo />
        </div>
      </Provider>
    );
  }
}

export default App;
