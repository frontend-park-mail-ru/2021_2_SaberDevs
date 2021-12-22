import {authorizationTypes,
  changePageTypes,
  mainPageTypes,
  signupFormTypes,
  modalTypes,
  apiTypes,
} from './types.js';

import {appendApiImg} from '../common/transformApi.js';

// ////////////////
// authorizationActions
// ////////////////

/**
 * @param {Object} userData
 * @return {Action}
 */
function login(userData) {
  appendApiImg(userData);
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
  cards.forEach((card) => {
    appendApiImg(card);
    appendApiImg(card.author);
  });
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
function unsetLoadingFlag() {
  return {
    type: mainPageTypes.UNSET_LOADING_FLAG,
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
 * @return {Action}
 */
function clearCards() {
  return {
    type: mainPageTypes.CLEAR_CARDS,
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

/**
 * @return {Action}
 */
function askNewCards() {
  return {
    type: mainPageTypes.ASK_NEW_CARDS,
  };
}

/**
 * @param {string} id
 * @return {Action}
 */
function deleteCard(id) {
  return {
    type: mainPageTypes.DELETE_CARD,
    payload: id,
  };
}

/**
 * @param {string} id
 * @param {number} sign
 * @param {number} newLikesNum
 * @return {Action}
 */
function like(id, sign, newLikesNum) {
  return {
    type: mainPageTypes.LIKE,
    payload: {id: id + '', sign, likes: newLikesNum},
  };
}

export const mainPageActions = {
  askNewCards,
  saveNewCards,
  clearCards,
  setLoadingFlag,
  unsetLoadingFlag,
  forbidCardsLoading,
  allowCardsLoading,
  toggleLogin,
  deleteCard,
  like,
};

// ////////////////
//    apiActions
// ////////////////

/**
 * @return {Action}
 */
function setUnavailable() {
  return {
    type: apiTypes.SET_UNAVAILABLE,
  };
}
/**
 * @return {Action}
 */
function setAvailable() {
  return {
    type: apiTypes.SET_AVAILABLE,
  };
}
export const apiActions = {
  setAvailable,
  setUnavailable,
};

// ////////////////
//    articleEditActions
// ////////////////

/**
 * @return {Action}
 */
function appendTag() {
  return {
    type: articleEditTypes.APPEND_TAG,
  };
}
/**
 * @return {Action}
 */
function removeTag() {
  return {
    type: articleEditTypes.REMOVE_TAG,
  };
}
/**
 * @param {Article} article Object<id, text, login>
 * @return {Action}
 */
function editExistingArticle(article) {
  appendApiImg(article.author);
  return {
    type: articleEditTypes.EDIT_EXISTING_ARTICLE,
    payload: article,
  };
}
/**
 * @return {Action}
 */
function createArticle() {
  return {
    type: articleEditTypes.CREATE_ARTICLE,
  };
}
/**
 * @param {String} title
 * @param {String} text
 * @return {Action}
 */
function saveText(title, text) {
  return {
    type: articleEditTypes.SAVE_TEXT,
    payload: {title, text},
  };
}

export const articleEditActions = {
  appendTag,
  removeTag,
  editExistingArticle,
  createArticle,
  saveText,
};
