import {profilePageTypes} from '../types.js';

// ////////////////
//  profilePageActions
// ////////////////

/**
 * @param {string} idLastLoaded
 * @param {Array<Card>} cards
 * @return {Action}
 */
function saveNewArticles(idLastLoaded, cards) {
  cards.forEach((card) => {
    appendApiImg(card);
    appendApiImg(card.author);
  });
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

/**
 * @param {string} id
 * @return {Action}
 */
function deleteArticle(id) {
  return {
    type: profilePageTypes.DELETE_CARD,
    payload: id,
  };
}


/**
 * @param {Object} user
 * @property {string} login
 * @property {string?} firstName
 * @property {string?} lastName
 * @property {string?} avatarUrl
 * @property {number?} score
 * @return {Action}
 */
function setUserLoading(user) {
  return {
    type: profilePageTypes.SET_USER_LOADING,
    payload: {
      firstName: 'загрузка',
      lastName: 'загрузка',
      avatarUrl: '',
      score: 0,
      ...user,
    },
  };
}

/**
 * @param {Object} user
 * @property {string} login
 * @property {string?} firstName
 * @property {string?} lastName
 * @property {email?} email
 * @property {string?} avatarUrl
 * @property {number?} score
 * @return {Action}
 */
function setUserInfo(user) {
  appendApiImg(user);
  return {
    type: profilePageTypes.SET_USER_INFO,
    payload: user,
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
    type: profilePageTypes.LIKE,
    payload: {id: id + '', sign, likes: newLikesNum},
  };
}

const profilePageActions = {
  setUserLoading,
  setUserInfo,
  askNewArticles,
  saveNewArticles,
  clearArticles,
  setArticlesLoadingFlag,
  unsetArticlesLoadingFlag,
  forbidArticlesLoading,
  allowArticlesLoading,
  deleteArticle,
  like,
};

export default profilePageActions;
