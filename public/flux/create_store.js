import {SYSTYPES} from './types.js'

export default function createStore(rootReducer, initialState) {
  if (fluxDebug) {
    console.log('store creation | rootReducer: ', rootReducer, 'initialState: ', initialState);
  }
  let state = rootReducer(initialState, {type: SYSTYPES.INIT});
  if (fluxDebug) {
    console.log('store creation | initialState after INIT: ', initialState);
  }
  const subscribers = {};

  return {
    dispatch(action) {
      state = rootReducer(state, action)
      subscribers[action.type] = subscribers[action.type] || []; 
      subscribers[action.type].forEach(subscriber => {
        if (fluxDebug) {
          console.log('subscribe trigger on', action.type, '. function: ', subscriber);
        }
        subscriber();
      });

      if (fluxDebug) {
        console.log('state after dispatch:');
        for (let i in state) {
          if (i === 'mainPage') {
            const state_copy = {};
            Object.assign(state_copy, state[i]);
            delete state_copy.cards;
            console.log(i + ': ' + JSON.stringify(state_copy), '\t(cards are omitted!)');
          } else {
            console.log(i + ': ' + JSON.stringify(state[i]));
          }
        }
      }
    },
    // return unsubscribe function
    subscribe(actionType, callback) {
      if (fluxDebug) {
        console.log('create subscription to', actionType, 'function: ', callback);
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