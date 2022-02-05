import {FluxMiddleWare, FluxEnchancedStore} from '../types';

/**
 * @param {FluxMiddleWare} Объект, удовлетворяющий Redux Middleware API
 * @property {Function} getState
 * @property {Function} dispatch
 * @return {Function} next
 */
 const thunk: FluxMiddleWare = ({getState, dispatch}) => {
  return function(next) {
    return function(action) {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      return next(action);
    };
  };
};

export default thunk;
