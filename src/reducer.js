// const initialState = {
//   queries: {
//     asdf_query: {
//       loading: false,
//       type: 'collection', // || 'document',
//       path: '',
//       // where ?
//       // orderBy ?
//       subscribed: true,
//       // save unsubscribe Function in pyrodux instance?
//       data: {
//         //...dataByIds
//       }
//     }
//     //...otherQueries
//   },
//   authUser: false // initially false, to be able to differentiate it from object null to know if auth has run
// };

const initialState_Query = {
  loading: false,
  data: {}
  // type: 'collection', // 'document'
  // path: '',
  // subscribed: false
};

const queryReducer = (state = initialState_Query, action) => {
  // single query level // state.pyrodux.queries.asdf_query
  switch (action.type) {
    case '@pyrodux_REGISTER_QUERY':
      return {
        ...state,
        loading: true, // overrides initialState
        type: action.type, // TODO
        path: action.path, // TODO
        subscribed: action.subscribed // TODO
      };
    case '@pyrodux_SET_LOADING':
      return {
        ...state,
        loading: action.isLoading === true
      };
    case '@pyrodux_RECEIVE_QUERY_DATA':
      return {
        ...state,
        data: action.data
      };
    case '@pyrodux_PATCH_QUERY_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data
        }
      };
    default:
      return state;
  }
};

const initialState_Data = {};

const dataReducer = (state = initialState_Data, action) => {
  // data level // state.pyrodux.queries
  switch (action.type) {
    case '@pyrodux_REGISTER_QUERY':
    case '@pyrodux_SET_LOADING':
    case '@pyrodux_RECEIVE_QUERY_DATA':
    case '@pyrodux_PATCH_QUERY_DATA':
      const queryState = state[action.collectionOrQueryName];
      return {
        ...state,
        [action.collectionOrQueryName]: queryReducer(queryState, action)
      };
    case '@pyrodux_UNLOAD_QUERY': // TODO refactor rename 'UNREGISTER_QUERY'
      const newState = { ...state };
      delete newState[action.collectionOrQueryName]; // TODO is there a better way to remove key-value-pair?
      return newState;
    default:
      return state;
  }
};

const initialState_Auth = false;

const authReducer = (state = initialState_Auth, action) => {
  // auth level // state.pyrodux.auth
  switch (action.type) {
    case '@pyrodux_SET_AUTH_USER':
      return action.authUser;
    default:
      return state;
  }
};

const reducer = (state = {}, action) => {
  return {
    queries: dataReducer(state.queries, action),
    authUser: authReducer(state.authUser, action)
  };
};

export default reducer;
