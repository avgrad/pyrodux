import { determineQueryType, getQueryPath } from './helpers';

export const setQueryData = (collectionOrQueryName, data) => ({
  type: '@pyrodux_SET_QUERY_DATA',
  collectionOrQueryName,
  data
});

export const patchQueryData = (collectionOrQueryName, data) => ({
  type: '@pyrodux_PATCH_QUERY_DATA',
  collectionOrQueryName,
  data
});

export const setDocumentData = (collectionOrQueryName, id, data) => ({
  type: '@pyrodux_PATCH_QUERY_DATA',
  collectionOrQueryName,
  data: {
    [id]: data
  }
});

export const removeDocument = (collectionOrQueryName, id) => ({
  type: '@pyrodux_REMOVE_DOCUMENT',
  collectionOrQueryName,
  id
});

export const setLoading = (collectionOrQueryName, isLoading) => ({
  type: '@pyrodux_SET_LOADING',
  collectionOrQueryName,
  isLoading
});

export const setAuthUser = authUser => ({
  type: '@pyrodux_SET_AUTH_USER',
  loggedIn: !!authUser,
  uid: authUser.uid,
  email: authUser.email,
  displayName: authUser.displayName,
  photoUrl: authUser.photoURL,
  emailVerified: authUser.emailVerified
});

export const registerQuery = (
  collectionOrQueryName,
  query,
  subscribed = false
) => ({
  type: '@pyrodux_REGISTER_QUERY',
  collectionOrQueryName,
  queryType: determineQueryType(query),
  path: getQueryPath(query),
  subscribed
});

export const registerQueryString = (collectionOrQueryName, queryString) => ({
  type: '@pyrodux_REGISTER_QUERYSTRING',
  collectionOrQueryName,
  queryString
});
