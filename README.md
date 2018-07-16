# Pyrodux

Pyrodux is a set of general redux actions to use the Firebase Firestore inside your react app.
It helps you to focus on the main parts of you app instead of data-handling the collections, queries and redux-state.

## Installation

```
npm install pyrodux
```

## Prerequisites

- initialized Firebase app (best with firestore and auth already imported)
- redux (with redux-thunk middleware, since actions are async)
- redux-form (if you want to make use of submission errors)

## What can it do?

- Authentication with E-Mail and Password (Login, Logout, Signup)
- retrieve data from collections and custom queries (also subscribe for changes)
- add/update/delete data from collections and custom queries

## How to use

### Initialization

Initialize via Pyrodux

```js
import pyrodux from 'pyrodux'; // import pyrodux instance
import { SubmissionError } from 'redux-form';

const config = {
  // your firebase config
};

// error rethrow is needed, because redux-form is not able to recognize
// SubmissionError class correctly when used inside node_modules
pyrodux.onErrorRethrow(err => {
  throw new SubmissionError({ _error: err.message })
});

const app = pyrodux.initializeApp(config);
const auth = pyrodux.auth();
const firestore = pyrodux.firestore();
```

Supply your Redux Store the reducer.

```js
import pyrodux from 'pyrodux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import otherRecucers from './otherReducers';

// create root reducer
const rootReducer = combineReducers({
  pyrodux: pyrodux.getReducer('pyrodux'), // supply the used reducer-key to pyrodux, default when empty is "entities"
  ...otherReducers
});

// create redux store
// redux thunk is required, because actions are async
const store = createStore(
  rootReducer,
  applyMiddleware(reduxThunk)
);
```

### Auth

You can use pyrodux to handle Authentication via Firebase.
Currently only Auth with E-Mail and Password is supported.

```js
import pyrodux from 'pyrodux';
import store from './store'; // wherever your store is

const firebaseAuth = pyrodux.auth();

// supply store to HOF to be able to dispatch actions
firebaseAuth.onAuthStateChanged(pyrodux.createOnAuthChangedHandler(store));
```

Then you can access actions and state via Pyrodux.

```js
import React from 'react';
import { connect } from 'react-redux';
import { actions, selectors } from 'pyrodux';
import LoginForm from './LoginForm'; // is a redux-form

const LoginPage = ({ handleSubmit, isLoggedIn, didAuthRun, userMail }) => didAuthRun && !isLoggedIn
  ? <LoginForm onSubmit={handleSubmit} />
  : (didAuthRun ? "user is logged in" : "auth event did not run yet");

export default connect(
  state => ({
    isLoggedIn: selectors.isLoggedIn(state),
    didAuthRun: selectors.didAuthRun(state)
  }),
  dispatch => ({
    handleSubmit: (values) => dispatch(actions.auth.doLoginWithEmailPassword(values.email, values.password))
  })
)(LoginPage);

```

### Firestore data

Use Actions and selectors to load and access data from Firestore.

#### Firestore collections

```js
import { actions, selectors } from 'pyrodux';

const ConnectedComponent = connect(
  state => ({
    messages: selectors.asArray("messages", state),
    messagesLoading: selectors.isLoading("messages", state)
  }),
  dispatch => ({
    loadMessages: () =
      dispatch(actions.data.retrieveCollection("messages"))
  })
)(SomeComponent);
```

#### Custom Firestore queries

You can also use custom queries with filters and sorting.

```js
import pyrodux, { actions, selectors } from 'pyrodux';

const query = pyrodux.firestore()
  .collection("your_collection")
  .where("field", ">", "2018-01-01")
  .orderBy("field");

const ConnectedComponent = connect(
  state => ({
    queryResult: selectors.asArray("customQuery", state),
    queryLoading: selectors.isLoading("customQuery", state)
  }),
  dispatch => ({
    loadMessages: () =>
      dispatch(actions.data.retrieveQuery("customQuery", query))
  })
)(SomeComponent);
```

##### Lazy Loading

You can dispatch retrieveQuery() multiple times with queries on the same collection, but different filters, to
do something like pagination or lazy-loading.

Pyrodux will put the later retrieved data in the state **additionally** to enable you to save requests.
The downside of this is, that filtering and sorting for your view must be done locally when mapping.
`selectors.asArray("customQuery").filter(yourFilterFunction).sort(yourSortingFunction)`

```js
const currentPageQuery = pyrodux.firestore()
  .collection("your_collection")
  .where("date", ">=", "2018-01-01")
  .where("date", "<", "2018-02-01");
const nextPageQuery = pyrodux.firestore()
  .collection("your_collection")
  .where("date", ">=", "2018-02-01")
  .where("date", "<", "2018-03-01");

const mapDispatchToProps = dispatch => ({
  loadCurrentPage: () => dispatch(actions.data.retrieveQuery("customQuery", currentPageQuery)),
  loadNextPage: () => dispatch(actions.data.retrieveQuery("customQuery", nextPageQuery))
});
```

### Available actions

```js
import { actions } from 'pyrodux';

 const exampleFirestoreQuery = { /* example see above */ };

const mapDispatchToProps = dispatch => ({
  // auth actions
  doLogin: (values) => dispatch(actions.auth.doLoginWithEmailPassword(values.email, values.password)),
  doLogout: () => dispatch(actions.auth.doLogout()),
  doSignUp: (values) => dispatch(actions.auth.doSignUpWithEmailPassword(values.email, values.password)),

  // data actions
  // dispatch these to load data and register query
  retrieveCollectionData: () => dispatch(actions.data.retrieveCollection("collectionName")),
  retrieveQueryData: () => dispatch(actions.data.retrieveQuery("queryName", exampleFirestoreQuery)),
  subscribeCollectionData: () => dispatch(actions.data.subscribeCollection("collectionName")),
  subscribeQueryData: () => dispatch(actions.data.subscribeQuery("queryName", exampleFirestoreQuery)),
  addItem: (values) => dispatch(actions.data.addItem("collectionOrQueryName", values)),
  updateItem: (values) => dispatch(actions.data.updateItem("collectionOrQueryName", values)),
  updateItemWhichIsDocRef: (values) => dispatch(actions.data.updateItemDoc("collectionOrQueryName", values)),
  deleteItem: (id) => dispatch(actions.data.deleteItem("collectionOrQueryname", id))
});
```

### Available selectors

```js
import { selectors } from 'pyrodux';

const mapStateToProps = state => ({
  // data as array of items
  queryOrCollectionAsArray = selectors.asArray("collectionOrQueryName", state),
  // data as object, with ids as keys
  queryOrCollectionAsObject = selectors.asObject("collectionOrQueryName", state),
  // loading state
  isLoading: selectors.isLoading("collectionOrQueryName", state),

  // auth selectors
  didAuthRun: selectors.didAuthRun(state),
  isLoggedIn: selectors.isLoggedIn(state),
  userEmail: selectors.userEmail(state, "user not logged in (argument optional)"),
  userDisplayName: selectors.userDisplayName(state, "user not logged in (argument optional)"),
  userPhotoUrl: selectors.userPhotoUrl(state, "user not logged in (argument optional)"),
  userId: selectors.userId(state, "user not logged in (argument optional)")
});
```

## NPM Scripts

- `build` -> build to `./build`
- `watch` -> watch for file changes, and build to `./build`
- `release` -> `npm publish build`
- `dev-init` -> install pyrodux dependencies, and install playground dependencies
- `playground:start` -> run playground app locally
- `dev-playground` -> watch for file changes to build pyrodux, and run playground locally

# TODO

- how to do "retrieveMore" with subscriptions????? because you cant "edit" a subscribed query
- does general firestore to object mapping work?
- create/update/delete callbacks? (in Pyrodux index class, or params to dispatches?)
  - supply redux-actions to pyrodux-action which will be dispatched?
- add/update of subscriptions will be handled twice (onsnapshot-handling *and* add().then()). is this okay?
