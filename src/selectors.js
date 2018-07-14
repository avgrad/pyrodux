import pyrodux from './';

const getPyroduxState = state => {
  return state[pyrodux.stateKey];
};

export const asObject = (collectionOrQueryName, state) => {
  const data = getPyroduxState(state).data[collectionOrQueryName];
  if (!!data) return data;
  else return {};
};

export const asArray = (collectionOrQueryName, state) => {
  const data = asObject(collectionOrQueryName, state);
  if (!!data) return Object.values(asObject(collectionOrQueryName, state));
  else return [];
};

export const isLoading = (collectionOrQueryName, state) => {
  return (
    Object.keys(getPyroduxState(state).loading).includes(
      collectionOrQueryName
    ) && getPyroduxState(state).loading[collectionOrQueryName] === true
  );
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
