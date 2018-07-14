import pyrodux from './';

const getPyroduxState = state => {
  return state[pyrodux.stateKey];
};

const getQueryState = (collectionOrQueryName, state) => {
  const queryState = getPyroduxState(state).queries[collectionOrQueryName];
  return queryState;
};

export const asObject = (collectionOrQueryName, state) => {
  const queryState = getQueryState(collectionOrQueryName, state);
  if (!queryState) return {};
  const data = queryState.data;
  if (!data) return {};
  return data;
};

export const asArray = (collectionOrQueryName, state) => {
  const data = asObject(collectionOrQueryName, state);
  if (!data) return [];
  return Object.values(data);
};

export const isLoading = (collectionOrQueryName, state) => {
  const queryState = getQueryState(collectionOrQueryName, state);
  if (!queryState) return false;
  return queryState.loading;
};

export const didAuthRun = state => {
  return !(
    typeof getPyroduxState(state).authUser === 'boolean' &&
    getPyroduxState(state).authUser === false
  );
};

export const isLoggedIn = state => {
  return !!getPyroduxState(state).authUser;
};

export const userEmail = (state, notLoggedInValue) => {
  return getPyroduxState(state).authUser
    ? getPyroduxState(state).authUser.email
    : notLoggedInValue;
};

export const userDisplayName = (state, notLoggedInValue) => {
  return getPyroduxState(state).authUser
    ? getPyroduxState(state).authUser.displayName
    : notLoggedInValue;
};

export const userPhotoUrl = (state, notLoggedInValue) => {
  return getPyroduxState(state).authUser
    ? getPyroduxState(state).authUser.photoURL
    : notLoggedInValue;
};

export const userId = (state, notLoggedInValue) => {
  return getPyroduxState(state).authUser
    ? getPyroduxState(state).authUser.uid
    : notLoggedInValue;
};

export const userEmailVerified = state => {
  return getPyroduxState(state).authUser
    ? getPyroduxState(state).emailVerified
    : false;
};
