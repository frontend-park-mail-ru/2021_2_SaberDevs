import createStore from "./create_store.js";
import {authorizeReducer, changePageReducer, mainPageReducer, combineReducers} from './reducers.js';

class Store {
}

const store = new Store();
Object.assign(store,
  createStore(combineReducers({
    authorization: authorizeReducer,
    page: changePageReducer,
    mainPage: mainPageReducer,
  })));

export default store;