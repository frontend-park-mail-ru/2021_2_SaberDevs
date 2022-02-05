import {SYSTYPES, FluxActionType, FluxAction, FluxStateObject, FluxReducer, FluxStore, FluxMiddleWare} from './types';
import applyMiddleware from './applyMiddleware';
import {fluxDebug} from '../globals';

type FluxSubscriber = (payload?: any) => void;
type FluxSubscriptionsMap = {
  [key: string]: FluxSubscriber[],
};


/**
 * @param {function(StateObject, Action)} rootReducer
 * @param {FluxStateObject} initialState
 * @param {FluxMiddleWare[]} middlewares
 * @return {FluxStore} store object
 */
export default function createStore(rootReducer: FluxReducer, initialState: FluxStateObject, ...middlewares: FluxMiddleWare[]): FluxStore {
  console.log('[STORE] createStore: ', middlewares.map((el) => el.name));
  const init = {type: SYSTYPES.INIT};
  let state: FluxStateObject = rootReducer(initialState, init);
  const subscribers: FluxSubscriptionsMap = {};

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
     * @param {FluxAction} action
     */
    dispatch(action: FluxAction<FluxActionType>) {
      state = rootReducer(state, action);
      subscribers[action.type] = subscribers[action.type] || [];
      subscribers[action.type].forEach((subscriber: FluxSubscriber) => {
        if (fluxDebug) {
          console.log('subscribe trigger on', action.type);
        }
        subscriber(action.payload);
      });
    },

    /**
     * оформить подписку на событие стора
     * @param {FluxActionType} actionType событие
     * @param {FluxSubscriber} callback реакция на событие
     * @return {Function} метод function() для отмены подписки
     */
    subscribe(actionType: FluxActionType, callback: FluxSubscriber): () => void {
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
    /**
     * @return {FluxStateObject}
     */
    getState(): FluxStateObject {
      return state;
    },
  };
}
