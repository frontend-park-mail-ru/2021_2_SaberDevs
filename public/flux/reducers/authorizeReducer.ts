import {AuthorizationTypes, FluxStateObject, FluxAction} from '../types';
import {User} from '../../common/types';

export interface AuthorizationStateObject extends FluxStateObject {
  isAuthenticated: boolean,
  login: string,
  avatarUrl: string,
  firstName: 'UNAUTHORIZED' | string,
  lastName: 'UNAUTHORIZED' | string,
  email: 'UNAUTHORIZED' | string,
  score: number,
};

export type AuthorizationAction = FluxAction<AuthorizationTypes>

const InitialUserState: AuthorizationStateObject = {
  isAuthenticated: false,
  login: '',
  avatarUrl: ``,
  firstName: 'UNAUTHORIZED',
  lastName: 'UNAUTHORIZED',
  email: 'UNAUTHORIZED',
  score: 0,
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function authorizeReducer(state: AuthorizationStateObject = InitialUserState, action: AuthorizationAction): AuthorizationStateObject {
  switch (action.type) {
    case AuthorizationTypes.LOGIN:
      if (action.payload.login === '') {
        console.warn('Trying to set an empty login. LOGIN action ignored');
        return state;
      }
      return {
        ...state,
        ...action.payload,
        login: action.payload.login || '',
        firstName: action.payload.firstName || '',
        lastName: action.payload.lastName || '',
        isAuthenticated: true,
      };
    case AuthorizationTypes.LOGOUT:
      return InitialUserState;
  }
  return state;
}
