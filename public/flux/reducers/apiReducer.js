import {apiTypes} from '../types.js';

const InitialAPIState = {
  isAvailable: true,
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function apiReducer(state = InitialAPIState, action) {
  switch (action.type) {
    case apiTypes.SET_AVAILABLE:
      return {
        ...state,
        isAvailable: true,
      };
    case apiTypes.SET_UNAVAILABLE:
      return {
        ...state,
        isAvailable: false,
      };
  }
  return state;
}
