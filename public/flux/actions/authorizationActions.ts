import {AuthorizationTypes} from '../types';
import {AuthorizationAction} from '../reducers/authorizeReducer';
import {User} from '../../common/types';
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
