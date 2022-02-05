import {AuthorizationTypes} from '../types';
import {AuthorizationAction, User} from '../reducers/authorizeReducer';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
// authorizationActions
// ////////////////

/**
 * @param {User} userData
 * @return {Action}
 */
 function login(userData: User): AuthorizationAction {
  appendApiImg(userData);
  return {
    type: AuthorizationTypes.LOGIN,
    payload: userData,
  };
}

/**
 * @return {Action}
 */
function logout(): AuthorizationAction {
  return {
    type: AuthorizationTypes.LOGOUT,
  };
}

const authorizationActions = {
  login,
  logout,
};

export default authorizationActions;
