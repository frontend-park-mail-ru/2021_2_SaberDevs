import createStore from './createStore';

import authorizeReducer from './reducers/authorizeReducer';
import {AuthorizationStateObject} from './reducers/authorizeReducer';
import changePageReducer from './reducers/changePageReducer';
import {ChangePageStateObject} from './reducers/changePageReducer';
import mainPageReducer from './reducers/mainPageReducer';
import {MainPageStateObject} from './reducers/mainPageReducer';
import profilePageReducer from './reducers/profilePageReducer';
import {ProfileStateObject} from './reducers/profilePageReducer';
import categoryPageReducer from './reducers/categoryPageReducer';
import {CategoryPageStateObject} from './reducers/categoryPageReducer';
import apiReducer from './reducers/apiReducer';
import editorReducer from './reducers/editorReducer';
import {EditorStateObject} from './reducers/editorReducer';
import readerReducer from './reducers/readerReducer';
import {ReaderStateObject} from './reducers/readerReducer';
import routerReducer from './reducers/routerReducer';
import streamReducer from './reducers/streamReducer';
import {StreamStateObject} from './reducers/streamReducer';
import searchPageReducer from './reducers/searchPageReducer';
import {SearchStateObject} from './reducers/searchPageReducer';
import combineReducers from './reducers/combineReducers';

import thunk from './middleWares/asyncHandleThunk';

import {FluxStateObject, FluxStore} from './types';

interface StoreStateObject extends FluxStateObject {
  router: FluxStateObject,

  authorization: AuthorizationStateObject,
  page: ChangePageStateObject,
  api: FluxStateObject,

  mainPage: MainPageStateObject,
  profilePage: ProfileStateObject,
  categoryPage: CategoryPageStateObject,
  search: SearchStateObject,
  editor: EditorStateObject,
  reader: ReaderStateObject,
  stream: StreamStateObject,
}

interface Store extends FluxStore {
  getState: () => StoreStateObject;
}

const store: Store = <Store>createStore(combineReducers({
  router: routerReducer,

  authorization: authorizeReducer,
  page: changePageReducer,
  api: apiReducer,

  mainPage: mainPageReducer,
  profilePage: profilePageReducer,
  categoryPage: categoryPageReducer,
  search: searchPageReducer,

  editor: editorReducer,
  reader: readerReducer,
  stream: streamReducer,
}), {}, thunk);

export default store;
