import {LOGIN, LOGOUT} from './types.js'

//function themeReducer(state = initialThemeState)

// export const rootReducer = combineReducers
function counterReducer(state = 0, action) {
  if (action.type === INCREMENT) {
    return state + 1
  } else if (action.type === DECREMENT) {
    return state - 1
  }

  return state
}

const InitialUserState = {
  login: '',
  name: 'UNAUTHORIZED',
  surname: 'UNAUTHORIZED',
  email: 'UNAUTHORIZED',
  score: 0,
}

export function authorizeReducer(state = InitialUserState, action) {
  if (fluxDebug) {
    console.log('authorizeReducer | prev state: ', state, 'action: ', action)
  }
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case LOGOUT:
      return InitialUserState;
  }
  return state
}