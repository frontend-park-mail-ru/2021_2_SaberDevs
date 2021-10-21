import createStore from './createStore.js';
import {
  authorizeReducer,
  changePageReducer,
  mainPageReducer,
  signupFormReducer,
  combineReducers,
} from './reducers.js';
import thunk from './middleWares/asyncHandleThunk.js';

const store = createStore(combineReducers({
  authorization: authorizeReducer,
  page: changePageReducer,
  mainPage: mainPageReducer,
  signupForm: signupFormReducer,
}), {}, thunk);

export default store;
