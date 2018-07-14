import * as authActions from './authActions';
import * as dataActions from './queryActions';

export const auth = authActions;
export const data = dataActions;

const actions = {
  auth: authActions,
  data: dataActions
};

export default actions;
