import {SYSTYPES, FluxActionType, FluxAction, FluxStateObject, FluxReducer, FluxStore} from './types';
import applyMiddleware from './applyMiddleware';
import {fluxDebug} from '../globals';

/**
 * @param {function(StateObject, Action)} rootReducer
 * @param {FluxStateObject} initialState
 * @param {FluxMiddleWare[]} middlewares
 * @return {FluxStore} store object
 */
export default function createStore(rootReducer: FluxReducer, initialState: FluxStateObject, ...middlewares: FluxMiddleWare[]): FluxStore {
  console.log('[STORE] createStore: ', middlewares.map((el) => el.name));
  let state = rootReducer(initialState, {type: SYSTYPES.INIT});
  const subscribers = {};

  if (middlewares.length !== 0) {
    return applyMiddleware(...middlewares)(createStore)(
        rootReducer, initialState,
    );
  }

  return {
    /**
     * Сначала вызывается соответсвующий reducer,
     * затем выполняются подписки.
     * В колбеки подписок передается payload
     * @param {Action} action
     */
    dispatch(action) {
      state = rootReducer(state, action);
      subscribers[action.type] = subscribers[action.type] || [];
      subscribers[action.type].forEach((subscriber) => {
        if (fluxDebug) {
          console.log('subscribe trigger on', action.type);
        }
        subscriber(action.payload);
      });
    },

    /**
     * оформить подписку на событие стора
     * @param {Action} actionType событие
     * @param {Function.Payload?} callback реакция на событие
     * @return {Function} метод function() для отмены подписки
     */
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
