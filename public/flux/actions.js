import {authorizationTypes,
  changePageTypes,
  mainPageTypes,
  signupFormTypes,
  modalTypes,
} from './types.js';

// ////////////////
// authorizationActions
// ////////////////

/**
 * @param {Object} userData
 * @return {Action}
 */
function login(userData) {
  return {
    type: authorizationTypes.LOGIN,
    payload: userData,
  };
}

/**
 * @return {Action}
 */
function logout() {
  return {
    type: authorizationTypes.LOGOUT,
  };
}

export const authorizationActions = {
  login,
  logout,
};


// ////////////////
// changePageActions
// ////////////////

/**
 * @param {string} page
 * @param {string} docTitle
 * @return {Action}
 */
function changePage(page, docTitle) {
  return {
    type: changePageTypes.CHANGE_PAGE,
    payload: {
      page,
      docTitle,
    },
  };
}

/**
 * @param {string} docTitle
 * @return {Action}
 */
function changeDocTitle(docTitle) {
  return {
    type: changePageTypes.CHANGE_DOC_TITLE,
    payload: {
      docTitle,
    },
  };
}

export const changePageActions = {
  changePage,
  changeDocTitle,
};


// ////////////////
// signupFormActions
// ////////////////

/**
 * @return {Action}
 */
function toggleToSignupForm() {
  return {
    type: signupFormTypes.SWITCH_FORM_TYPE,
    payload: true,
  };
}

/**
 * @return {Action}
 */
function toggleToSigninForm() {
  return {
    type: signupFormTypes.SWITCH_FORM_TYPE,
    payload: false,
  };
}

export const signupFormActions = {
  toggleToSignupForm,
  toggleToSigninForm,
};


// ////////////////
// modalctions
// ////////////////

/**
 * @return {Action}
 */
function modalClose() {
  return {
    type: modalTypes.MODAL_CLOSE,
  };
}

/**
 * @return {Action}
 */
function modalOpen() {
  return {
    type: modalTypes.MODAL_OPEN,
  };
}

export const modalActions = {
  modalOpen,
  modalClose,
};


// ////////////////
// mainPageActions
// ////////////////

/**
 * @param {string} idLastLoaded
 * @param {Array<Object>} cards
 * @return {Action}
 */
function saveNewCards(idLastLoaded, cards) {
  return {
    type: mainPageTypes.SAVE_NEW_CARDS,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @return {Action}
 */
function setLoadingFlag() {
  return {
    type: mainPageTypes.SET_LOADING_FLAG,
  };
}

/**
 * @return {Action}
 */
function forbidCardsLoading() {
  return {
    type: mainPageTypes.FORBID_CARDS_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function allowCardsLoading() {
  return {
    type: mainPageTypes.ALLOW_CARDS_UPLOADING,
  };
}

/**
 * @param {boolean} isAuthenticated
 * @param {string} login
 * @return {Action}
 */
function toggleLogin(isAuthenticated, login) {
  return {
    type: mainPageTypes.TOGGLE_AUTH,
    payload: {
      isAuthenticated,
      login,
    },
  };
}

export const mainPageActions = {
  saveNewCards,
  setLoadingFlag,
  forbidCardsLoading,
  allowCardsLoading,
  toggleLogin,
};
