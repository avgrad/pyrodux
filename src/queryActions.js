import pyrodux from './';
import {
  mapCollectionArrayToObject,
  mapFirestoreSnapshotToJsObject,
  mapJsObjectToFirestoreDocument,
  mapFirestoreDocumentChangeToJsObject
} from './mappingHelpers';
import { determineQueryType } from './helpers';
import { getQueryState, isQueryNameKnown } from './selectorHelpers';
import * as internalActions from './internalActions';

const getQueryAsCollectionOrDoc = (collectionOrQueryName, state) => {
  const firestore = pyrodux.firestore();
  const queryState = getQueryState(collectionOrQueryName, state);

  if (!queryState) {
    throw new Error('query with name ' + collectionOrQueryName + ' not found');
  }

  switch (queryState.type) {
    case 'doc':
      return firestore.doc(queryState.path);
    case 'collection':
    case 'query':
      return firestore.collection(queryState.path);
    default:
      throw new Error(
        'unsupported query type for this action (' + queryState.type + ')'
      );
  }
};

export const retrieveQuery = (queryName, query) => (dispatch, getState) => {
  var queryState = getQueryState(queryName, getState());
  const queryType = determineQueryType(query);
  if (!queryState) {
    dispatch(internalActions.registerQuery(queryName, query));
    queryState = getQueryState(queryName, getState());
  } else if (queryType === 'doc') {
    // TODO decide what to do with docref-queries on second retrieve
  }

  if (queryType === 'query' || queryType === 'collection') {
    const queryString = query._query.toString();
    const queryPath = query._query.path.toString();

    if (queryState.path !== queryPath) {
      throw new Error(
        'query path must be the same as before.',
        queryState.path,
        queryPath
      );
    }

    if (queryState.knownQueries.includes(queryString)) {
      // query data is already loaded into state
      return null;
    }

    dispatch(internalActions.registerQueryString(queryName, queryString));
  }

  dispatch(internalActions.setLoading(queryName, true));

  return (
    query
      .get()
      .then(mapFirestoreSnapshotToJsObject)
      .then(data => {
        if (isQueryNameKnown(queryName, getState()))
          dispatch(internalActions.patchQueryData(queryName, data));
      })
      // TODO catch? throw to previously registered callback in pyrodux-instance?
      .finally(() => {
        if (isQueryNameKnown(queryName, getState()))
          dispatch(internalActions.setLoading(queryName, false));
      })
  );
};

export const retrieveCollection = collectionName => {
  const firestore = pyrodux.firestore();
  const query = firestore.collection(collectionName);
  return retrieveQuery(collectionName, query);
};

export const subscribeQuery = (queryName, query) => (dispatch, getState) => {
  if (isQueryNameKnown(queryName, getState())) {
    throw new Error('a query with this name is already registered', queryName);
  }

  dispatch(internalActions.registerQuery(queryName, query));
  dispatch(internalActions.setLoading(queryName, true));

  const unsubscribe = query.onSnapshot(querySnapshot => {
    if (typeof querySnapshot.docChanges === 'function') {
      // querysnapshot, enumerable
      const dataAddedOrChanged = mapCollectionArrayToObject(
        querySnapshot
          .docChanges() // added modified removed
          .filter(
            documentChange =>
              documentChange.type === 'added' ||
              documentChange.type === 'modified'
          )
          .map(mapFirestoreDocumentChangeToJsObject)
      );
      if (isQueryNameKnown(queryName, getState()))
        dispatch(internalActions.patchQueryData(queryName, dataAddedOrChanged));
    } else {
      // document snapshot
      const newDocumentData = mapFirestoreSnapshotToJsObject(querySnapshot);
      if (isQueryNameKnown(queryName, getState()))
        dispatch(internalActions.setQueryData(queryName, newDocumentData));
    }
    // TODO adds/changes will be pushed to state twice (also in add().then() and update().then())
    // or is it okay to create patch-action twice?
    // TODO handle remove here? (will remove from local state because of delete().then())

    dispatch(internalActions.setLoading(queryName, false));
  });

  // register in pyrodux instance, to be able to unsubscribe on unregisterQuery()
  pyrodux.registerSubscription(queryName, unsubscribe);
};

export const subscribeCollection = collectionName => {
  const firestore = pyrodux.firestore();
  const query = firestore.collection(collectionName);
  return subscribeQuery(collectionName, query);
};

export const addItem = (collectionOrQueryName, data) => (
  dispatch,
  getState
) => {
  const query = getQueryAsCollectionOrDoc(collectionOrQueryName, getState());

  const submitData = mapJsObjectToFirestoreDocument(data);
  return query
    .add(submitData)
    .then(docRef => {
      return {
        ...data,
        id: docRef.id
      };
    })
    .then(item => {
      dispatch(
        internalActions.setDocumentData(collectionOrQueryName, item.id, item)
      );
    })
    .catch(err => pyrodux.tryRethrowError(err));
};

export const updateItem = (collectionOrQueryName, id, data) => (
  dispatch,
  getState
) => {
  const query = getQueryAsCollectionOrDoc(collectionOrQueryName, getState());

  const submitData = mapJsObjectToFirestoreDocument(data);
  return query
    .doc(id)
    .update(submitData) // or set? update does not work if json-field is "removed"
    .then(() => {
      return {
        ...data,
        id
      };
    })
    .then(item => {
      dispatch(
        internalActions.setDocumentData(collectionOrQueryName, item.id, item)
      );
    })
    .catch(err => pyrodux.tryRethrowError(err));
};

export const updateItemDoc = (queryName, data) => (dispatch, getState) => {
  const docRef = getQueryAsCollectionOrDoc(queryName, getState());
  const queryType = determineQueryType(docRef);
  if (queryType !== 'doc') {
    throw new Error('query for update item as doc is not a doc reference');
  }

  const submitData = mapJsObjectToFirestoreDocument(data);
  return docRef
    .set(submitData)
    .then(() => {
      return {
        ...data,
        id: docRef.id
      };
    })
    .then(data => {
      dispatch(internalActions.setQueryData(queryName, data));
    })
    .catch(err => pyrodux.tryRethrowError(err));
};

export const deleteItem = (collectionOrQueryName, id) => (
  dispatch,
  getState
) => {
  const query = getQueryAsCollectionOrDoc(collectionOrQueryName, getState());
  return query
    .doc(id)
    .delete()
    .then(() =>
      dispatch(internalActions.removeDocument(collectionOrQueryName, id))
    );
};

export const unloadCollectionOrQuery = collectionOrQueryName => dispatch => {
  // pyrodux will unsubscribe subscription
  pyrodux.unregisterSubscription(collectionOrQueryName);
  dispatch({
    type: '@pyrodux_UNREGISTER_QUERY',
    collectionOrQueryName
  });
};
