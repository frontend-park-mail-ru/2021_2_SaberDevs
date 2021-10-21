/**
 * @param  {...Function} funcs
 * @return {Function}
 */
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
      (a, b) =>
        a(b(...args)),
  );
}

/**
 * extends (wraps) default store
 * @param  {...any} middlewares
 * @return {any}
 */
export default function applyMiddleware(...middlewares) {
  console.warn('applyMiddleware: ' + middlewares);
  return function(createStore) {
    // второй - необяхательный
    return function(reducer, preloadedState) {
      const store = createStore(reducer, preloadedState);
      let dispatch = () => {
        console.warn(
            'Dispatching while constructing your middleware is not allowed. ' +
            'Other middleware would not be applied to this dispatch.',
        );
      };

      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args),
      };
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));
      dispatch = compose(...chain)(store.dispatch);

      return {
        ...store,
        dispatch,
      };
    };
  };
}
