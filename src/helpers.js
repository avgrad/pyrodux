// returns one of ["query", "collection", "doc"]
export const determineQueryType = query => {
  switch (query.constructor.name) {
    case 'DocumentReference':
      return 'doc';
    case 'CollectionReference':
      return 'collection';
    case 'Query$$1':
      return 'query';
    default:
      throw new Error('unsupported query type for this action');
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
