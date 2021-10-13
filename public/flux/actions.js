import {authorizationTypes, changePageTypes, mainPageTypes, signupFormTypes, modalTypes} from './types.js'

// ////////////////
// authorizationActions
// ////////////////

function login(userData) {
  return {
    type: authorizationTypes.LOGIN,
    payload: userData,
  };
}

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

function changePage(page, docTitle) {
  return {
    type: changePageTypes.CHANGE_PAGE,
    payload: {
      page,
      docTitle,
    },
  };
}

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

function toggleToSignupForm() {
  return {
    type: signupFormTypes.SWITCH_FORM_TYPE,
    payload: true,
  };
}

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

function modalClose() {
  return {
    type: modalTypes.MODAL_CLOSE,
  };
}

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

function saveNewCards(idLastLoaded, cards) {
  return {
    type: mainPageTypes.SAVE_NEW_CARDS,
    payload: {idLastLoaded, cards},
  };
}

function setLoadingFlag() {
  return {
    type: mainPageTypes.SET_LOADING_FLAG,
  };
}

function forbidCardsLoading() {
  return {
    type: mainPageTypes.FORBID_CARDS_UPLOADING,
  };
}

function allowCardsLoading() {
  return {
    type: mainPageTypes.ALLOW_CARDS_UPLOADING,
  };
}

function toggle_login(isAuthenticated, login) {
  return {
    type: mainPageTypes.TOGGLE_AUTH,
    payload: {
      isAuthenticated,
      login
    },
  };
}

export const mainPageActions = {
  saveNewCards,
  setLoadingFlag,
  forbidCardsLoading,
  allowCardsLoading,
  toggle_login,
};

// ////////////////
// else
// ////////////////

export function asyncIncrement() {
  return function(dispatch) {
    dispatch(disableButtons())
    setTimeout(() => {
      dispatch(increment())
      dispatch(enableButtons())
    }, 1500)
  };
};