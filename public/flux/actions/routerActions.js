import {RouterTypes} from '../types';

/**
 * @param {string} to путь, куда нужно совершить переход
 * @return {Action}
 */
function redirect(to) {
  return {
    type: RouterTypes.REDIRECT,
    payload: to,
  };
}

const routerActions = {
  redirect,
};

export default routerActions;
