import {routerTypes} from '../types.js';

const InitialRouterState = {};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function routerReducer(state = InitialRouterState, action) {
  switch (action.type) {
    case routerTypes.REDIRECT:
      return {...state};
  }
  return state;
}
