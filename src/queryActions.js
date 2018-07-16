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
  const firestore = pyrodux.getFirestore();
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
  if (isQueryNameKnown(queryName, getState())) {
    throw new Error('a query with this name is already registered', queryName);
  }

  dispatch(internalActions.registerQuery(queryName, query));
  dispatch(internalActions.setLoading(queryName, true));

  return query
    .get()
    .then(mapFirestoreSnapshotToJsObject)
    .then(data => dispatch(internalActions.setQueryData(queryName, data)))
    .finally(() => {
      return dispatch(internalActions.setLoading(queryName, false));
    });
};

const retrieveMoreForQuery = (
  collectionOrQueryName,
  queryFilterApplicator = q => q
) => (dispatch, getState) => {
  // TODO export and test
  const collection = getQueryAsCollectionOrDoc(
    collectionOrQueryName,
    getState()
  );
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

export const retrieveCollection = collectionName => {
  const firestore = pyrodux.getFirestore();
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
      dispatch(internalActions.patchQueryData(queryName, dataAddedOrChanged));
    } else {
      // document snapshot
      const newDocumentData = mapFirestoreSnapshotToJsObject(querySnapshot);
      dispatch(internalActions.setQueryData(queryName, newDocumentData));
    }
    // TODO adds/changes will be pushed to state twice (also in add().then() and update().then())
    // or is it okay to create patch-action twice?
    // TODO handle remove here? (will remove from local state because of delete().then())

    dispatch(internalActions.setLoading(queryName, false));
  });

  // TODO what to do with unsubscribe function?
};

export const subscribeCollection = collectionName => {
  const firestore = pyrodux.getFirestore();
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
    .update(submitData) // or set? update does not work if json-field is "removed"
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
  dispatch({
    type: '@pyrodux_UNREGISTER_QUERY',
    collectionOrQueryName
  });
};
