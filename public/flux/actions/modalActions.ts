import {ModalAction} from '../reducers/modalReducer';
import {ModalTypes} from '../types';

// ////////////////
// modalctions
// ////////////////

/**
 * @return {Action}
 */
 function modalClose(): ModalAction {
  return {
    type: ModalTypes.MODAL_CLOSE,
  };
}

/**
 * @return {Action}
 */
function modalOpen(): ModalAction {
  return {
    type: ModalTypes.MODAL_OPEN,
  };
}

const modalActions = {
  modalOpen,
  modalClose,
};

export default modalActions;
