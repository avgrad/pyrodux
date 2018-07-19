// returns one of ["query", "collection", "doc"]
export const determineQueryType = query => {
  if (typeof query.collection === 'function') {
    return 'doc';
  } else if (typeof query.doc === 'function') {
    return 'collection';
  } else if (!!query._query) {
    return 'query';
  } else {
    throw new Error(
      'unsupported query type for this action "' + query.constructor.name + '"'
    );
  }
};

export const getQueryPath = query => {
  const queryType = determineQueryType(query);
  if (queryType === 'doc') {
    return query.path;
  } else if (queryType === 'collection') {
    return query.path;
  } else if (queryType === 'query') {
    return query._query.path.toString();
  } else {
    throw new Error('unsupported query type for this action');
  }
};
