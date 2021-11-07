import createStore from './createStore.js';

import authorizeReducer from './reducers/authorizeReducer.js';
import changePageReducer from './reducers/changePageReducer.js';
import mainPageReducer from './reducers/mainPageReducer.js';
import profilePageReducer from './reducers/profilePageReducer.js';
import categoryPageReducer from './reducers/categoryPageReducer.js';
import signupFormReducer from './reducers/signupFormReducer.js';
import apiReducer from './reducers/apiReducer.js';
import editorReducer from './reducers/editorReducer.js';
import combineReducers from './reducers/combineReducers.js';

import thunk from './middleWares/asyncHandleThunk.js';

const store = createStore(combineReducers({
  authorization: authorizeReducer,
  page: changePageReducer,

  mainPage: mainPageReducer,
  profilePage: profilePageReducer,
  categoryPage: categoryPageReducer,

  signupForm: signupFormReducer,
  api: apiReducer,
  editor: editorReducer,
}), {}, thunk);

export default store;
