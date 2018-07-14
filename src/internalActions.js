export const receiveQueryData = (collectionOrQueryName, data) => ({
  type: '@pyrodux_RECEIVE_QUERY_DATA',
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

export const setLoading = (collectionOrQueryName, isLoading) => ({
  type: '@pyrodux_SET_LOADING',
  collectionOrQueryName,
  isLoading
});

export const setAuthUser = authUser => ({
  type: '@pyrodux_SET_AUTH_USER',
  authUser
});

export default {
  receiveQueryData,
  patchQueryData,
  setDocumentData,
  setLoading,
  setAuthUser
};
