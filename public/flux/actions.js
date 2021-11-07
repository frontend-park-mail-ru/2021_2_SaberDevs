import {authorizationTypes,
  changePageTypes,
  mainPageTypes,
  signupFormTypes,
  modalTypes,
  apiTypes,
  profilePageTypes,
  categoryPageTypes,
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

export const mainPageActions = {
  askNewCards,
  saveNewCards,
  clearCards,
  setLoadingFlag,
  unsetLoadingFlag,
  forbidCardsLoading,
  allowCardsLoading,
  toggleLogin,
};

// ////////////////
//  profilePageActions
// ////////////////

/**
 * @param {string} idLastLoaded
 * @param {Array<Card>} cards
 * @return {Action}
 */
function saveNewArticles(idLastLoaded, cards) {
  return {
    type: profilePageTypes.SAVE_NEW_USER_ARTICLES,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @return {Action}
 */
function clearArticles() {
  return {
    type: profilePageTypes.CLEAR_USER_ARTICLES,
  };
}

/**
 * @return {Action}
 */
function setArticlesLoadingFlag() {
  return {
    type: profilePageTypes.SET_USER_ARTICLES_LOADING,
  };
}

/**
 * @return {Action}
 */
function unsetArticlesLoadingFlag() {
  return {
    type: profilePageTypes.UNSET_USER_ARTICLES_LOADING,
  };
}

/**
 * @return {Action}
 */
function forbidArticlesLoading() {
  return {
    type: profilePageTypes.FORBID_USER_ARTICLES_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function allowArticlesLoading() {
  return {
    type: profilePageTypes.ALLOW_USER_ARTICLES_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function askNewArticles() {
  return {
    type: profilePageTypes.ASK_NEW_USER_ARTICLES,
  };
}

export const profilePageActions = {
  askNewArticles,
  saveNewArticles,
  clearArticles,
  setArticlesLoadingFlag,
  unsetArticlesLoadingFlag,
  forbidArticlesLoading,
  allowArticlesLoading,
};

// ////////////////
//  CategoryPageActions
// ////////////////

/**
 * @param {string} idLastLoaded
 * @param {Array<Card>} cards
 * @return {Action}
 */
function saveNewCategoryArticles(idLastLoaded, cards) {
  return {
    type: categoryPageTypes.SAVE_NEW_CATEGORY_ARTICLES,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @return {Action}
 */
function clearCategoryArticles() {
  return {
    type: categoryPageTypes.CLEAR_CATEGORY_ARTICLES,
  };
}

/**
 * @return {Action}
 */
function setCategoryArticlesLoadingFlag() {
  return {
    type: categoryPageTypes.SET_CATEGORY_ARTICLES_LOADING,
  };
}

/**
 * @return {Action}
 */
function unsetCategoryArticlesLoadingFlag() {
  return {
    type: categoryPageTypes.UNSET_CATEGORY_ARTICLES_LOADING,
  };
}

/**
 * @return {Action}
 */
function forbidCategoryArticlesLoading() {
  return {
    type: categoryPageTypes.FORBID_CATEGORY_ARTICLES_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function allowCategoryArticlesLoading() {
  return {
    type: categoryPageTypes.ALLOW_CATEGORY_ARTICLES_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function askNewCategoryArticles() {
  return {
    type: categoryPageTypes.ASK_NEW_CATEGORY_ARTICLES,
  };
}

/**
 * @param {string} tag
 * @return {Action}
 */
function selectCategoryTag(tag) {
  return {
    type: categoryPageTypes.SELECT_CATEGORY_ARTICLES_TAG,
    payload: tag,
  };
}

/**
 * @return {Action}
 */
function clearSelectedCategoryTags() {
  return {
    type: categoryPageTypes.CLEAR_CATEGORY_ARTICLES_TAG,
  };
}

export const categoryPageActions = {
  setCategoryArticlesLoadingFlag,
  unsetCategoryArticlesLoadingFlag,
  forbidCategoryArticlesLoading,
  allowCategoryArticlesLoading,
  askNewCategoryArticles,
  saveNewCategoryArticles,
  clearCategoryArticles,
  selectCategoryTag,
  clearSelectedCategoryTags,
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
