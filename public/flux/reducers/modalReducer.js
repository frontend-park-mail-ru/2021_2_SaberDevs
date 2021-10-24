import {modalTypes} from '../types.js';

import {} from './dataModels/mainPageDM.js';

const InitialModalState = {};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function modalReducer(state = InitialModalState, action) {
  switch (action.type) {
    case modalTypes.MODAL_OPEN:
      return state;
    case modalTypes.MODAL_CLOSE:
      return state;
  }
  return state;
}
