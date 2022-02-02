import {RouterTypes, FluxStateObject, FluxAction} from '../types';

const InitialRouterState: FluxStateObject = {};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function routerReducer(state: FluxStateObject = InitialRouterState, action: FluxAction): FluxStateObject {
  switch (action.type) {
    case RouterTypes.REDIRECT:
      return {...state};
  }
  return state;
}
