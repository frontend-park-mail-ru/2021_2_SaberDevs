import {AuthorizationTypes,
  ChangePageTypes,
  MainPageTypes,
  SignupFormTypes,
  ModalTypes,
  ApiTypes,
  FluxAction,
} from './types';

import {appendApiImg} from '../common/transformApi.js';


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
    type: ChangePageTypes.CHANGE_PAGE,
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
    type: ChangePageTypes.CHANGE_DOC_TITLE,
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
    type: SignupFormTypes.SWITCH_FORM_TYPE,
    payload: true,
  };
}

/**
 * @return {Action}
 */
function toggleToSigninForm() {
  return {
    type: SignupFormTypes.SWITCH_FORM_TYPE,
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
    type: ModalTypes.MODAL_CLOSE,
  };
}

/**
 * @return {Action}
 */
function modalOpen() {
  return {
    type: ModalTypes.MODAL_OPEN,
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
    type: MainPageTypes.SAVE_NEW_CARDS,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @return {Action}
 */
function setLoadingFlag() {
  return {
    type: MainPageTypes.SET_LOADING_FLAG,
  };
}

/**
 * @return {Action}
 */
function unsetLoadingFlag() {
  return {
    type: MainPageTypes.UNSET_LOADING_FLAG,
  };
}

/**
 * @return {Action}
 */
function forbidCardsLoading() {
  return {
    type: MainPageTypes.FORBID_CARDS_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function allowCardsLoading() {
  return {
    type: MainPageTypes.ALLOW_CARDS_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function clearCards() {
  return {
    type: MainPageTypes.CLEAR_CARDS,
  };
}

/**
 * @return {Action}
 */
function askNewCards() {
  return {
    type: MainPageTypes.ASK_NEW_CARDS,
  };
}

/**
 * @param {string} id
 * @return {Action}
 */
function deleteCard(id) {
  return {
    type: MainPageTypes.DELETE_CARD,
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
    type: MainPageTypes.LIKE,
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
    type: ApiTypes.SET_UNAVAILABLE,
  };
}
/**
 * @return {Action}
 */
function setAvailable() {
  return {
    type: ApiTypes.SET_AVAILABLE,
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
    type: ArticleEditTypes.APPEND_TAG,
  };
}
/**
 * @return {Action}
 */
function removeTag() {
  return {
    type: ArticleEditTypes.REMOVE_TAG,
  };
}
/**
 * @param {Article} article Object<id, text, login>
 * @return {Action}
 */
function editExistingArticle(article) {
  appendApiImg(article.author);
  return {
    type: ArticleEditTypes.EDIT_EXISTING_ARTICLE,
    payload: article,
  };
}
/**
 * @return {Action}
 */
function createArticle() {
  return {
    type: ArticleEditTypes.CREATE_ARTICLE,
  };
}
/**
 * @param {String} title
 * @param {String} text
 * @return {Action}
 */
function saveText(title, text) {
  return {
    type: ArticleEditTypes.SAVE_TEXT,
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
