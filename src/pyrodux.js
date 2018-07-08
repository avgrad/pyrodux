import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import reducer from "./reducer";

import { setAuthUser } from "./internalActions";

class Pyrodux {
  queries = {};
  stateKey = null;

  initializeApp(config) {
    return firebase.initializeApp(config);
  }

  auth() {
    return firebase.auth();
  }

  firestore() {
    return firebase.firestore();
  }

  getFirestore() {
    if (firebase.apps.length > 0) {
      if (!firebase.firestore) throw new Error("firestore not imported");
      return firebase.firestore();
    }
    throw new Error("Firebase App not initialized!");
  }

  getAuth() {
    if (firebase.apps.length > 0) {
      if (!firebase.auth) throw new Error("firebase auth not imported");
      return firebase.auth();
    }
    throw new Error("Firebase App not initialized!");
  }

  createOnAuthChangedHandler(store) {
    return authUser => {
      console.log("auth state changed handled by pyrodux", authUser);
      store.dispatch(setAuthUser(authUser));
    };
  }

  getReducer(stateKey = "entities") {
    this.stateKey = stateKey;
    return reducer;
  }

  registerQuery(queryName, query) {
    if (Object.keys(this.queries).includes(queryName)) {
      throw new Error("query name already exists");
    }
    this.queries[queryName] = query;
  }

  // TODO register onSuccess/onError handlers here for all add/edit/delete actions?
}

export default Pyrodux;
