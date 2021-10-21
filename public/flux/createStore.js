import {SYSTYPES} from './types.js';
import applyMiddleware from './applyMiddleware.js';

/**
 * @param {function(StateObject, Action)} rootReducer
 * @param {StateObject} initialState
 * @param {Array.Function} middlewares
 * @return {Object} store
 */
export default function createStore(rootReducer, initialState, ...middlewares) {
  console.warn('createStore: ', middlewares);
  let state = rootReducer(initialState, {type: SYSTYPES.INIT});
  const subscribers = {};

  if (middlewares.length !== 0) {
    return applyMiddleware(...middlewares)(createStore)(
        rootReducer, initialState,
    );
  }

  return {
    dispatch(action) {
      state = rootReducer(state, action);
      subscribers[action.type] = subscribers[action.type] || [];
      subscribers[action.type].forEach((subscriber) => {
        if (fluxDebug) {
          console.log('subscribe trigger on', action.type);
        }
        subscriber();
      });
    },

    subscribe(actionType, callback) {
      if (fluxDebug) {
        console.log('create subscription to', actionType);
      }
      subscribers[actionType] = subscribers[actionType] || [];
      subscribers[actionType].push(callback);
      // return unsubscribe function
      return function() {
        subscribers[actionType]
            .splice(subscribers[actionType].indexOf(callback));
      };
    },
    getState() {
      return state;
    },
  };
}
