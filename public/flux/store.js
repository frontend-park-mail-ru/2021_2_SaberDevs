import createStore from './createStore.js';
import {
  authorizeReducer,
  changePageReducer,
  mainPageReducer,
  signupFormReducer,
  combineReducers,
} from './reducers.js';

const store = createStore(combineReducers({
  authorization: authorizeReducer,
  page: changePageReducer,
  mainPage: mainPageReducer,
  signupForm: signupFormReducer,
}));

export default store;
