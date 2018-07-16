import pyrodux from './';

export const getPyroduxState = state => {
  return state[pyrodux.stateKey];
};

export const getQueryState = (queryName, state) => {
  const queryState = getPyroduxState(state).queries[queryName];
  return queryState;
};

export const isQueryNameKnown = (queryName, state) => {
  return queryName in state[pyrodux.stateKey].queries;
};
