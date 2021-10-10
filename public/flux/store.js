import {SYSTYPES} from './types.js'

export default function createStore(rootReducer, initialState) {
  if (fluxDebug) {
    console.log('store creation | rootReducer: ', rootReducer, 'initialState: ', initialState)
  }
  let state = rootReducer(initialState, {type: SYSTYPES.INIT})
  if (fluxDebug) {
    console.log('store creation | initialState after INIT: ', initialState)
  }
  const subscribers = []

  return {
    dispatch(action) {
      state = rootReducer(state, action)
      subscribers.forEach(subscriber => subscriber())
    },
    subscribe(callback) {
      subscribers.push(callback)
    },
    getState() {
      return state
    }
  }
}