import pyrodux from './';

// returns one of ["query", "collection", "doc"]
export const determineQueryType = query => {
  // create references, to determine names of babel-minified names of constructors
  // refs must be created here, because creating them outside of the function, will
  // throw an error, that "pyrodux" is undefined
  const referenceQueryTypeDocument = pyrodux
    .firestore()
    .collection('some_collection')
    .doc('some_document').constructor.name;
  const referenceQueryTypeCollection = pyrodux
    .firestore()
    .collection('some_collection').constructor.name;
  const referenceQueryTypeQuery = pyrodux
    .firestore()
    .collection('some_collection')
    .where('some_field', '==', 'some_value').constructor.name;

  switch (query.constructor.name) {
    case referenceQueryTypeDocument:
      return 'doc';
    case referenceQueryTypeCollection:
      return 'collection';
    case referenceQueryTypeQuery:
      return 'query';
    default:
      throw new Error(
        'unsupported query type for this action "' +
          query.constructor.name +
          '"'
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
