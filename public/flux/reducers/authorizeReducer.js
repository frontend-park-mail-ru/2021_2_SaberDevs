import {authorizationTypes} from '../types.js';

const InitialUserState = {
  login: '',
  avatar: `../static/img/users/user.jpg`,
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
      return {
        ...state,
        ...action.payload,  // так избегаем неправильных payload'ов
      };
    case authorizationTypes.LOGOUT:
      return state;
  }
  return state;
}
