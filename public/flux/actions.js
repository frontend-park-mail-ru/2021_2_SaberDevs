import {authorizationTypes, changePageTypes, mainPageTypes} from './types.js'

// ////////////////
// authorizationActions
// ////////////////

function login(userData) {
  return {
    type: authorizationTypes.LOGIN,
    payload: userData,
  }
}

function logout() {
  return {
    type: authorizationTypes.LOGOUT,
  }
}

export const authorizationActions = {
  login,
  logout,
}


// ////////////////
// changePageActions
// ////////////////

function changePage(page) {
  return {
    type: changePageTypes.CHANGE_PAGE,
    payload: page,
  }
}

export const changePageActions = {
  changePage
}


// ////////////////
// mainPageActions
// ////////////////

function saveNewCards(idLastLoaded, cards) {
  return {
    type: mainPageTypes.SAVE_NEW_CARDS,
    payload: {idLastLoaded, cards},
  }
}

function setLoadingFlag() {
  return {
    type: mainPageTypes.SET_LOADING_FLAG,
  }
}

function forbidCardsLoading() {
  return {
    type: mainPageTypes.FORBID_CARDS_UPLOADING,
  }
}

function allowCardsLoading() {
  return {
    type: mainPageTypes.ALLOW_CARDS_UPLOADING,
  }
}

export const mainPageActions = {
  saveNewCards,
  setLoadingFlag,
  forbidCardsLoading,
  allowCardsLoading
}

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
  }
}