import {routerTypes} from '../types.js';

/**
 * @param {string} to путь, куда нужно совершить переход
 * @return {Action}
 */
function redirect(to) {
  return {
    type: routerTypes.REDIRECT,
    payload: to,
  };
}

const routerActions = {
  redirect,
};

export default routerActions;
