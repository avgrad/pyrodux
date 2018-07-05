import { SubmissionError } from "redux-form"; // make SubmissionError import conditional? via other file with exports conditionally if module found?
import pyrodux from "./";
import {
  mapFirestoreSnapshotToJsObject,
  mapJsObjectToFirestoreDocument
} from "./mappingHelpers";
import internalActions from "./internalActions";

const getQueryAsCollection = collectionOrQueryName => {
  const firestore = pyrodux.getFirestore();
  const query = pyrodux.queries[collectionOrQueryName];
  if (!!query) {
    throw new Error("query with name " + collectionOrQueryName + " not found");
  }

  if (typeof query.collection === "function") {
    // query is for doc
    // TODO wat do when query goes directly for document?
    throw new Error("query is document!");
  } else if (typeof query.doc === "function") {
    // query is actually collection by itself
    return query;
  }

  const path = query._query.path.toString();
  return firestore.collection(path);
};

const isQueryNameKnown = (collectionOrQueryName, state) => {
  return (
    collectionOrQueryName in state.entities.loading ||
    collectionOrQueryName in state.entities.data
  );
};

export const retrieveQuery = (queryName, query) => (dispatch, getState) => {
  if (isQueryNameKnown(queryName, getState())) {
    throw new Error("a query with this name is already registered", queryName);
  }
  pyrodux.registerQuery(queryName, query);

  dispatch(internalActions.setLoading(queryName, true));
  //console.log("query", query);
  //console.log("queryid", query._query.toString());
  return query
    .get()
    .then(mapFirestoreSnapshotToJsObject)
    .then(data => dispatch(internalActions.receiveQueryData(queryName, data)))
    .finally(() => {
      return dispatch(internalActions.setLoading(queryName, false));
    });
};

const retrieveMoreForQuery = (
  collectionOrQueryName,
  queryFilterApplicator = q => q
) => dispatch => {
  // TODO export and test
  const collection = getQueryAsCollection(collectionOrQueryName);
  const moreQuery = queryFilterApplicator(collection);

  dispatch(internalActions.setLoading(collectionOrQueryName, true));

  return moreQuery
    .get()
    .then(mapFirestoreSnapshotToJsObject)
    .then(data =>
      dispatch(internalActions.patchQueryData(collectionOrQueryName, data))
    )
    .finally(() => {
      return dispatch(internalActions.setLoading(collectionOrQueryName, false));
    });
};

export const retrieveCollection = collectionName => dispatch => {
  const firestore = pyrodux.getFirestore();
  const query = firestore.collection(collectionName);
  return retrieveQuery(collectionName, query);
};

export const subscribeQuery = (queryName, query) => dispatch => {
  throw new Error("not implemented yet", subscribeQuery);
  // TODO
};

export const subscribeCollection = collectionName => dispatch => {
  throw new Error("not implemented yet", subscribeCollection);
  // TODO
};

export const addItem = (collectionOrQueryName, data) => dispatch => {
  const query = getQueryAsCollection(collectionOrQueryName);

  const submitData = mapJsObjectToFirestoreDocument(data);
  return query
    .add(submitData)
    .then(docRef => {
      return {
        ...data,
        id: docRef.id
      };
    })
    .catch(err => {
      throw new SubmissionError(err.message);
    });
};

export const updateItem = (collectionOrQueryName, id, data) => dispatch => {
  const query = getQueryAsCollection(collectionOrQueryName);

  const submitData = mapJsObjectToFirestoreDocument(data);
  return query
    .doc(id)
    .update(submitData)
    .then(() => {
      return {
        ...data,
        id
      };
    })
    .catch(err => {
      throw new SubmissionError(err.message);
    });
};

export const deleteItem = (collectionOrQueryName, id) => dispatch => {
  const query = getQueryAsCollection(collectionOrQueryName);
  return query.doc(id).delete();
};
