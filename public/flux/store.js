import createStore from './createStore.js';

import authorizeReducer from './reducers/authorizeReducer.js';
import changePageReducer from './reducers/changePageReducer.js';
import mainPageReducer from './reducers/mainPageReducer.js';
import signupFormReducer from './reducers/signupFormReducer.js';
import combineReducers from './reducers/combineReducers.js';

import thunk from './middleWares/asyncHandleThunk.js';

const store = createStore(combineReducers({
  authorization: authorizeReducer,
  page: changePageReducer,
  mainPage: mainPageReducer,
  signupForm: signupFormReducer,
}), {}, thunk);

export default store;
