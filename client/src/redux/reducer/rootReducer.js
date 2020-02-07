import { combineReducers } from 'redux';

import auth from './auth';
import user from './user';
import search from './search';

const combinedReducer = combineReducers({
  auth,
  user,
  search
});

export default combinedReducer;
