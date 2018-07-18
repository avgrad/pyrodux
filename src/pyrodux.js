import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import reducer from './reducer';

import { setAuthUser } from './internalActions';

class Pyrodux {
  stateKey = null;
  subscriptions = {};

  initializeApp(config) {
    return firebase.initializeApp(config);
  }

  auth() {
    return firebase.auth();
  }

  firestore() {
    return firebase.firestore();
  }

  createOnAuthChangedHandler(store) {
    return authUser => {
      console.log('auth state changed handled by pyrodux', authUser);
      store.dispatch(setAuthUser(authUser));
    };
  }

  getReducer(stateKey = 'entities') {
    this.stateKey = stateKey;
    return reducer;
  }

  registerSubscription(queryName, unsubscribeFn) {
    if (queryName in this.subscriptions) {
      throw new Error('query is already subscribed to');
    }
    this.subscriptions[queryName] = { unsubscribe: unsubscribeFn };
  }

  unregisterSubscription(queryName) {
    if (queryName in this.subscriptions) {
      const query = this.subscriptions[queryName];
      query.unsubscribe();
      delete this.subscriptions[queryName];
    }
  }

  onErrorRethrowAction = null;
  onErrorRethrow(callback) {
    this.onErrorRethrowAction = callback.bind(this);
  }

  tryRethrowError(err) {
    if (typeof this.onErrorRethrowAction === 'function') {
      this.onErrorRethrowAction(err);
    }
  }

  // TODO register onSuccess/onError handlers here for all add/edit/delete actions?
}

export default Pyrodux;
