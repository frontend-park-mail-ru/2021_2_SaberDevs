import {/*ThemeTypes,*/ FluxStateObject, FluxAction} from '../types';

// import {
//   InitialMainPageState,
//   headerLinksOnLogout,
//   headerLinksOnLogin,
// } from './dataModels/mainPageDM.js';

// TODO:
const InitialThemeState = {};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function themeReducer(state: FluxStateObject = InitialThemeState, action: FluxAction): FluxStateObject {
  switch (action.type) {
    case 'LOGIN':
      return state;
  }
  return state;
}
