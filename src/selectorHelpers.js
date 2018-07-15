import pyrodux from './';

export const getPyroduxState = state => {
  return state[pyrodux.stateKey];
};

export const getQueryState = (collectionOrQueryName, state) => {
  const queryState = getPyroduxState(state).queries[collectionOrQueryName];
  return queryState;
};
