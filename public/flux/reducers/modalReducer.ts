import {ModalTypes, FluxStateObject, FluxAction} from '../types';

const InitialModalState: FluxStateObject = {};
export type ModalAction = FluxAction<ModalTypes>;

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function modalReducer(state: FluxStateObject = InitialModalState, action: ModalAction): FluxStateObject {
  switch (action.type) {
    case ModalTypes.MODAL_OPEN:
      return state;
    case ModalTypes.MODAL_CLOSE:
      return state;
  }
  return state;
}
