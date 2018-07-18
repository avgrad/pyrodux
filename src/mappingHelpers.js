import pyrodux from './';

export const mapFirestoreDocumentChangeToJsObject = documentChange => {
  return mapFirestoreDocumentSnapshotToJsObject(documentChange.doc);
};

export const mapFirestoreSnapshotToJsObject = querySnapshot => {
  if (querySnapshot.docs)
    return mapFirestoreCollectionSnapshotToJsObject(querySnapshot);
  else {
    return mapFirestoreDocumentSnapshotToJsObject(querySnapshot);
  }
};

export const mapFirestoreCollectionSnapshotToJsObject = querySnapshot => {
  return mapCollectionArrayToObject(
    querySnapshot.docs.map(mapFirestoreDocumentSnapshotToJsObject)
  );
};

export const mapFirestoreDocumentSnapshotToJsObject = docSnapshot => {
  if (docSnapshot.exists === false) return null;
  const fsData = docSnapshot.data();
  if ('id' in fsData)
    throw new Error("original firestore data already contains 'id' -Property");
  const resultData = {
    id: docSnapshot.id, // put id in doc-data
    ...fsData
  };
  // handle documentreferences to extract ids
  Object.keys(resultData).forEach(k => {
    if (resultData[k].constructor.name === 'DocumentReference') {
      //console.log(k + " is a document reference");
      // k is the name of a document reference
      // TODO better registering the reference
      // for now just map it to the document path and "register" it by a "meta"-property
      resultData[k] = resultData[k].path;
      resultData['__pyrodux__docref__' + k] = true;
      // TODO also handle timestamps etc
    }
  });
  // TODO what about references inside ob object inside document? docData.asdf.docRefThing
  return resultData;
};

export const mapJsObjectToFirestoreDocument = data => {
  // TODO does this work?
  // TODO what about references inside ob object inside document? docData.asdf.docRefThing
  const fsData = { ...data };
  delete fsData.id;
  Object.keys(fsData).forEach(k => {
    if (fsData['__pyrodux__docref__' + k] === true) {
      delete fsData['__pyrodux__docref__' + k];
      const docRef = pyrodux.firestore().doc(fsData[k]);
      fsData[k] = docRef;
      // TODO also handle timestamps etc
    }
  });
  return fsData;
};

export const mapCollectionArrayToObject = collectionArray => {
  const data = {};
  collectionArray.forEach(docData => (data[docData.id] = docData));
  return data;
};

export const deepCloneConvert = (obj, propValidationChangeFunction) => {
  const clone = {};
  const deleteKeys = [];
  var addValues = {}; // TODO const
  const allKeys = Object.keys(obj);
  allKeys.forEach(propKey => {
    var propVal = obj[propKey];
    if (propValidationChangeFunction) {
      const propChangeResult = propValidationChangeFunction(
        propVal,
        propKey,
        allKeys
      );
      if (propChangeResult.delete && propChangeResult.delete.length > 0)
        propChangeResult.delete.forEach(dk => deleteKeys.push(dk));
      if (propChangeResult.add)
        addValues = { ...addValues, ...propChangeResult.add };
      propVal = propChangeResult.value;
      if (deleteKeys.includes(propKey)) return;
    }

    if (typeof propVal === 'object') {
      // object
      clone[propKey] = deepCloneConvert(propVal, propValidationChangeFunction);
    } else if (Array.isArray(propVal)) {
      // array
      clone[propKey] = propVal.map(arrVal =>
        deepCloneConvert(arrVal, propValidationChangeFunction)
      );
    } else {
      // simple value
      clone[propKey] = propVal;
    }
  });

  deleteKeys.forEach(dk => delete clone[dk]);
  Object.keys(addValues).forEach(avk => (clone[avk] = addValues[avk]));

  return clone;
};

const samplePropValidationChangeFunction = (propVal, propKey, allKeys) => {
  return {
    add: {
      thiswill: 'be spreaded',
      accrossthe: 'cloneObj'
    },
    delete: ['these', 'keys', 'deleted'],
    value: propVal
  };
};
