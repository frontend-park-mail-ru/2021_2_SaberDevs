/**
 * @param {function(StateObject, Action)} reducers
 * @return {function(StateObject, Action)}
 */
export default function combineReducers(reducers) {
  for (const reducer in reducers) {
    if (typeof(reducers[reducer]) !== 'function') {
      console.warn(
          `Reducers Combiner: ${reducer} is not a function.
          It will not be called. It is a ${typeof(reducers[reducer])}.`,
      );
      delete reducers[reducer.name];
    }
  }
  return function(state, action) {
    if (!state) {
      state = {};
    }

    for (const reducer in reducers) {
      const newState = reducers[reducer](state[reducer], action);
      if (newState !== state[reducer]) {
        let printState = state[reducer];
        let printNewState = newState;
        // Игнор логов поля cards в этих редьюсерах
        if (fluxDebug) {
          if (reducer === 'mainPage' ||
              reducer === 'profilePage' ||
              reducer === 'categoryPage') {
            printState = {};
            Object.assign(printState, state[reducer]);
            delete printState.cards;
            printNewState = {};
            Object.assign(printNewState, newState);
            delete printNewState.cards;
          }
          if (reducer === 'editor') {
            printState = {};
            Object.assign(printState, state[reducer]);
            for (const id in printState) {
              if (printState[id].img && printState[id].img !== '') {
                printState[id].img =
                    'data:image/png;base64,(контент картинки)';
              }
            }
            printNewState = {};
            Object.assign(printNewState, newState);
            for (const id in printNewState) {
              if (printNewState[id].img && printNewState[id].img !== '') {
                printNewState[id].img =
                    'data:image/png;base64,(контент картинки)';
              }
            }
          }
          console.log(`${reducer} | action: , ${action.type}
          \t| prev state:\n${JSON.stringify(printState)}
          \t| new state:\n${JSON.stringify(printNewState)}
          `);
        }
        state[reducer] = newState;
      }
    }
    return state;
  };
}
