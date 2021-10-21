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

// This is an action creator that returns a thunk:
// function netWalker(forPerson) {
//   // We can invert control here by returning a function - the "thunk".
//   // When this function is passed to `dispatch`, the thunk middleware will intercept it,
//   // and call it with `dispatch` and `getState` as arguments.
//   // This gives the thunk function the ability to run some logic, and still interact with the store.
//   return function(dispatch) {
//     return fetchSecretSauce().then(
//       (sauce) => dispatch(makeASandwich(forPerson, sauce)),
//       (error) => dispatch(apologize('The Sandwich Shop', forPerson, error)),
//     );
//   };
// }