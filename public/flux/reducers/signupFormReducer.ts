import {SignupFormTypes, FluxStateObject, FluxAction} from '../types';

type AuthorizationStateObject = FluxStateObject & {showRegister: boolean};

const InitialSignupFormState: AuthorizationStateObject = {
  showRegister: true,
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function signupFormReducer(
    state: AuthorizationStateObject = InitialSignupFormState,
    action: FluxAction,
) {
  switch (action.type) {
    case SignupFormTypes.SWITCH_FORM_TYPE:
      return {
        ...state,
        showRegister: action.payload,
      };
  }
  return state;
}
