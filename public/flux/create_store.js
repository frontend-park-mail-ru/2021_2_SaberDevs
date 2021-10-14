import {SYSTYPES} from './types.js'

export default function createStore(rootReducer, initialState) {
  let state = rootReducer(initialState, {type: SYSTYPES.INIT});
  const subscribers = {};

  return {
    dispatch(action) {
      state = rootReducer(state, action)
      subscribers[action.type] = subscribers[action.type] || []; 
      subscribers[action.type].forEach(subscriber => {
        if (fluxDebug) {
          console.log('subscribe trigger on', action.type);
        }
        subscriber();
      });
    },
    // return unsubscribe function
    subscribe(actionType, callback) {
      if (fluxDebug) {
        console.log('create subscription to', actionType);
      }
      subscribers[actionType] = subscribers[actionType] || [];
      subscribers[actionType].push(callback);
      return function() {
        subscribers[actionType].splice(subscribers[actionType].indexOf(callback));
      }
    },
    getState() {
      return state;
    }
  }
}