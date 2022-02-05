import {RouterTypes, FluxStateObject, FluxAction} from '../types';

const InitialRouterState: FluxStateObject = {};
export type RouterAction = FluxAction<RouterTypes>;

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function routerReducer(state: FluxStateObject = InitialRouterState, action: RouterAction): FluxStateObject {
  switch (action.type) {
    case RouterTypes.REDIRECT:
      return {...state};
  }
  return state;
}
