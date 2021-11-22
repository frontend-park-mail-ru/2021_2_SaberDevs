import Ajax from '../../modules/ajax.js';
import {authorizationTypes} from '../types.js';

const InitialUserState = {
  isAuthenticated: false,
  login: '',
  avatarUrl: Ajax.APIurl + '/img/',
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
export default function authorizeReducer(state = InitialUserState, action) {
  switch (action.type) {
    case authorizationTypes.LOGIN:
      if (action.payload.login === '') {
        console.warn('Trying to set an empty login. LOGIN action ignored');
        return state;
      }
      return {
        ...state,
        ...action.payload,
        avatarUrl: Ajax.APIurl + '/img/' + action.payload.avatarUrl,
        isAuthenticated: true,
      };
    case authorizationTypes.LOGOUT:
      return InitialUserState;
  }
  return state;
}
