import {ApiTypes, FluxStateObject, FluxAction} from '../types';

const InitialAPIState = {
  isAvailable: true,
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function apiReducer(state: FluxStateObject = InitialAPIState, action: FluxAction): FluxStateObject {
  switch (action.type) {
    case ApiTypes.SET_AVAILABLE:
      return {
        ...state,
        isAvailable: true,
      };
    case ApiTypes.SET_UNAVAILABLE:
      return {
        ...state,
        isAvailable: false,
      };
  }
  return state;
}
