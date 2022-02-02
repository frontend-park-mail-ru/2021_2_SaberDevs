/**
 * @param  {...Function} funcs
 * @return {Function}
 */
function compose(...funcs: Function[]): Function {
  if (funcs.length === 0) {
    return arguments[0];
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
      (a, b) =>
        a(b(...arguments)),
  );
}

type FluxMiddleWare = Function;
/**
 * extends (wraps) default store
 * @param  {...FluxMiddleWare} middlewares
 * @return {any}
 */
export default function applyMiddleware(...middlewares: FluxMiddleWare[]) {
  return function(createStore: FluxStoreCreationFunction) {
    return function(reducer, preloadedState) {
      const store = createStore(reducer, preloadedState);
      let dispatch = () => {
        console.error(
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
