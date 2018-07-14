const initialState = {
  loading: {
    //collectionOrQueryName: true
  },
  data: {
    //collectionOrQueryName: { some: "data", from: "firebase" }
  },
  authUser: false // false to be able to differentiate it from object to know if auth has run
};

const reducer = (state = initialState, action) => {
  //console.log("pyrodux reducer incoming action:", action);
  switch (action.type) {
    case '@pyrodux_SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.collectionOrQueryName]: action.isLoading === true
        }
      };
    case '@pyrodux_RECEIVE_QUERY_DATA':
      //console.log("received query data", action.collectionOrQueryName, action.data);
      return {
        ...state,
        data: {
          ...state.data,
          [action.collectionOrQueryName]: action.data
        }
      };
    case '@pyrodux_PATCH_QUERY_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          [action.collectionOrQueryName]: {
            ...state.data[action.collectionOrQueryName],
            ...action.data
          }
        }
      };
    case '@pyrodux_SET_AUTH_USER':
      return {
        ...state,
        authUser: action.authUser
      };
    case '@pyrodux_UNLOAD_QUERY':
      const newData = { ...state.data };
      delete newData[action.collectionOrQueryName];
      const newLoading = { ...state.loading };
      delete newLoading[action.collectionOrQueryName];

      return {
        ...state,
        loading: newLoading,
        data: newData
      };
    default:
      return state;
  }
};

export default reducer;
