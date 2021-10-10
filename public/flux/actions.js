import {LOGIN, LOGOUT} from './types.js'

// const store = createStore {
//   rootReducer,
//   appl
// }

export function login(userData) {
  return {
    type: LOGIN,
    payload: userData,
  }
}

export function asyncIncrement() {
  return function(dispatch) {
    dispatch(disableButtons())
    setTimeout(() => {
      dispatch(increment())
      dispatch(enableButtons())
    }, 1500)
  }
}