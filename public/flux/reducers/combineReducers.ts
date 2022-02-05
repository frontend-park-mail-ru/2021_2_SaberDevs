import {fluxDebug} from '../../globals';
import {FluxStateObject, FluxAction, FluxReducer} from '../types';

type WithBigArray = {cards: any[]};
type FluxReducerMap = {
  [name: string]: FluxReducer,
}

/**
 * возвращает редьюсер, работающий с объектом вида
 * {
 *  reducer1: stateObject1
 *  reducer2: stateObject2
 *           ...
 *  reducerN: stateObjectN
 * }
 * @param {Reducer} reducers
 * @return {Reducer}
 */
export default function combineReducers(reducers: FluxReducerMap): FluxReducer {
  for (const reducer in reducers) {
    if (typeof(reducers[reducer]) !== 'function') {
      console.warn(
          `Reducers Combiner: ${reducer} is not a function.
          It will not be called. It is a ${typeof(reducers[reducer])}.`,
      );
      delete reducers[reducer];
    }
  }
  return function(state: FluxStateObject, action: FluxAction<any>): FluxStateObject {
    if (!state) {
      state = {};
    }

    for (const reducer in reducers) {
      const newState = reducers[reducer](state[reducer], action);
      if (JSON.stringify(newState) !== JSON.stringify(state[reducer])) {
        let printState = state[reducer];
        let printNewState = newState;
        if (fluxDebug) {
          if (
            reducer === 'mainPage' ||
              reducer === 'profilePage' ||
              reducer === 'search' ||
              reducer === 'categoryPage') {
            printState = {};
            Object.assign(printState, state[reducer]);
            delete printState.cards;
            printNewState = {};
            Object.assign(printNewState, newState);
            delete (<WithBigArray>printNewState).cards;
          }
          if (reducer === 'editor') {
            printState = {};
            for (const id in state[reducer]) {
              printState[id] = {};
              Object.assign(printState[id], state[reducer][id]);
              if (printState[id].img && printState[id].img !== '') {
                printState[id].img =
                    'data:image/png;base64,(контент картинки)';
              }
            }
            printNewState = {};
            for (const id in newState) {
              printNewState[id] = {};
              Object.assign(printNewState[id], newState[id]);
              if (printNewState[id].img && printNewState[id].img !== '') {
                printNewState[id].img =
                    'data:image/png;base64,(контент картинки)';
              }
            }
          }
          if (reducer === 'reader' && action.type !== '__INIT__') {
            // изи создание глубокой копии
            // внимание на '__INIT__' - там пустой объект. его нельзя запарсить
            printState = JSON.parse(JSON.stringify(state[reducer]));
            printNewState = JSON.parse(JSON.stringify(newState));
            for (const articleID in printState) {
              if (typeof printState[articleID] === 'object') {
                printState[articleID].text = 'текст вырезан в combinereducers';
              }
            }
            for (const articleID in printNewState) {
              if (typeof printState[articleID] === 'object') {
                printNewState[articleID].text='текст вырезан в combinereducers';
              }
            }
          }
          console.log(`${reducer} | action: ${action.type}`,
              '\n\t| prev state:\n', {...printState},
              '\n\t| new state:\n', {...printNewState},
          );
        }
        state[reducer] = newState;
      }
    }
    return state;
  };
}
