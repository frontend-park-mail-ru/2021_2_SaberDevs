import {authorizationTypes,
  changePageTypes,
  mainPageTypes,
  signupFormTypes,
  modalTypes,
} from './types.js';

import {
  InitialMainPageState,
  headerLinksOnLogout,
  headerLinksOnLogin,
} from '../models/mainPageConfig.js';

import {InitialUserState} from '../models/authorization.js';
import {InitialPageState} from '../models/page.js';


// TODO: function themeReducer(state = initialThemeState)

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export function authorizeReducer(state = InitialUserState, action) {
  switch (action.type) {
    case authorizationTypes.LOGIN:
      return action.payload;
    case authorizationTypes.LOGOUT:
      return InitialUserState;
  }
  return state;
}

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export function changePageReducer(state = InitialPageState, action) {
  switch (action.type) {
    case changePageTypes.CHANGE_PAGE:
      document.title = action.payload.docTitle;
      return {
        ...state,
        page: action.payload.page,
        docTitle: action.payload.docTitle,
      };
    case changePageTypes.CHANGE_DOC_TITLE:
      document.title = action.payload.docTitle;
      return {
        ...state,
        docTitle: action.payload.docTitle,
      };
  }
  return state;
}


const InitialSignupFormState = {showRegister: true};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export function signupFormReducer(state = InitialSignupFormState, action) {
  switch (action.type) {
    case signupFormTypes.SWITCH_FORM_TYPE:
      return {
        ...state,
        showRegister: action.payload,
      };
  }
  return state;
}


/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export function mainPageReducer(state = InitialMainPageState, action) {
  switch (action.type) {
    case mainPageTypes.SET_LOADING_FLAG:
      return {
        ...state,
        isLoading: true,
      };
    case mainPageTypes.FORBID_CARDS_UPLOADING:
      return {
        ...state,
        doNotUpload: true,
      };
    case mainPageTypes.ALLOW_CARDS_UPLOADING:
      return {
        ...state,
        doNotUpload: false,
      };
    case mainPageTypes.SAVE_NEW_CARDS:
      return {
        ...state,
        isLoading: false,
        idLastLoaded: action.payload.idLastLoaded,
        cards: state.cards.concat(action.payload.cards),
      };
    case mainPageTypes.TOGGLE_AUTH:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        login: action.payload.login,
        headerLinks: action.payload.isAuthenticated ?
          headerLinksOnLogin : headerLinksOnLogout,
      };
  }
  return state;
}


const InitialModalState = {};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export function modalReducer(state = InitialModalState, action) {
  switch (action.type) {
    case modalTypes.MODAL_OPEN:
      return state;
    case modalTypes.MODAL_CLOSE:
      return state;
  }
  return state;
}

/**
 * @param {function(StateObject, Action)} reducers
 * @return {function(StateObject, Action)}
 */
export function combineReducers(reducers) {
  for (const reducer in reducers) {
    if (typeof(reducers[reducer]) !== 'function') {
      console.warn(
          `Reducers Combiner: ${reducer} is not a function.
          It will not be called. It is a ${typeof(reducers[reducer])}.`,
      );
      delete reducers[reducer.name];
    }
  }
  return function(state, action) {
    if (!state) {
      state = {};
    }

    for (const reducer in reducers) {
      const newState = reducers[reducer](state[reducer], action);
      if (newState !== state[reducer]) {
        let printState = state[reducer];
        let printNewState = newState;
        if (fluxDebug) {
          if (reducer === 'mainPage') {
            printState = {};
            Object.assign(printState, state[reducer]);
            delete printState.cards;
            delete printState.headerLinks;
            delete printState.sideBarLinks;
            printNewState = {};
            Object.assign(printNewState, newState);
            delete printNewState.cards;
            delete printNewState.headerLinks;
            delete printNewState.sideBarLinks;
          }
          console.log(`${reducer} | action: , ${action.type}
          \t| prev state:\n${JSON.stringify(printState)}
          \t| new state:\n${JSON.stringify(printNewState)}
          `);
        }
        state[reducer] = newState;
      }
    }
    return state;
  };
}
