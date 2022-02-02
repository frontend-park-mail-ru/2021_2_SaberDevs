import {ModalTypes, FluxStateObject, FluxAction} from '../types';

const InitialModalState: FluxStateObject = {};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function modalReducer(state: FluxStateObject = InitialModalState, action: FluxAction): FluxStateObject {
  switch (action.type) {
    case ModalTypes.MODAL_OPEN:
      return state;
    case ModalTypes.MODAL_CLOSE:
      return state;
  }
  return state;
}
