/**
 * @param {Object} Объект, удовлетворяющий Redux Middleware API
 * @property {Function} getState
 * @property {Function} dispatch
 * @return {Function} next
 */
export default function thunk({getState, dispatch}) {
  return function(next) {
    return function(action) {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      return next(action);
    };
  };
};

