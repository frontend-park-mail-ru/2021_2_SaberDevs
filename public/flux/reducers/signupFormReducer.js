import {signupFormTypes} from '../types.js';

const InitialSignupFormState = {showRegister: true};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function signupFormReducer(
    state = InitialSignupFormState
    , action,
) {
  switch (action.type) {
    case signupFormTypes.SWITCH_FORM_TYPE:
      return {
        ...state,
        showRegister: action.payload,
      };
  }
  return state;
}
