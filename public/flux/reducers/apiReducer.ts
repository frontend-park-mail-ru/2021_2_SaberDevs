import {ApiTypes, FluxStateObject, FluxAction} from '../types';

const InitialAPIState = {
  isAvailable: true,
};

export type ApiAction = FluxAction<ApiTypes>;

/**
 * @param {Object} state
 * @param {ApiAction} action
 * @return {State}
 */
export default function apiReducer(state: FluxStateObject = InitialAPIState, action: ApiAction): FluxStateObject {
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
