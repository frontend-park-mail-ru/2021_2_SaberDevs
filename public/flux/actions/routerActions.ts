import {RouterTypes} from '../types';
import {RouterAction} from '../reducers/routerReducer';

/**
 * @param {string} to путь, куда нужно совершить переход
 * @return {Action}
 */
function redirect(to): RouterAction {
  return {
    type: RouterTypes.REDIRECT,
    payload: to,
  };
}

const routerActions = {
  redirect,
};

export default routerActions;
