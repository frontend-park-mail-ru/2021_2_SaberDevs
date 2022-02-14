import {ProfilePageTypes, CommonTypes} from '../types';
import {ProfileAction} from '../reducers/profilePageReducer';
import {Article} from '../../common/types';
import {User} from '../../common/types';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
//  profilePageActions
// ////////////////

/**
 * @param {number} idLastLoaded
 * @param {Array<Article>} cards
 * @return {ProfileAction}
 */
function saveNewArticles(idLastLoaded: number, cards: Article[]): ProfileAction {
  cards.forEach((card) => {
    appendApiImg(card);
    appendApiImg(card.author);
  });
  return {
    type: ProfilePageTypes.SAVE_NEW_USER_ARTICLES,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @return {ProfileAction}
 */
function clearArticles(): ProfileAction {
  return {
    type: ProfilePageTypes.CLEAR_USER_ARTICLES,
  };
}

/**
 * @return {ProfileAction}
 */
function setArticlesLoadingFlag(): ProfileAction {
  return {
    type: ProfilePageTypes.SET_USER_ARTICLES_LOADING,
  };
}

/**
 * @return {ProfileAction}
 */
function unsetArticlesLoadingFlag(): ProfileAction {
  return {
    type: ProfilePageTypes.UNSET_USER_ARTICLES_LOADING,
  };
}

/**
 * @return {ProfileAction}
 */
function forbidArticlesLoading(): ProfileAction {
  return {
    type: ProfilePageTypes.FORBID_USER_ARTICLES_UPLOADING,
  };
}

/**
 * @return {ProfileAction}
 */
function allowArticlesLoading(): ProfileAction {
  return {
    type: ProfilePageTypes.ALLOW_USER_ARTICLES_UPLOADING,
  };
}

/**
 * @return {ProfileAction}
 */
function askNewArticles(): ProfileAction {
  return {
    type: ProfilePageTypes.ASK_NEW_USER_ARTICLES,
  };
}

/**
 * @param {number} id
 * @return {ProfileAction}
 */
function deleteArticle(id: number) {
  return {
    type: CommonTypes.DELETE_CARD,
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
 * @return {ProfileAction}
 */
function setUserLoading(user) {
  return {
    type: ProfilePageTypes.SET_USER_LOADING,
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
 * @param {User} user
 * @return {ProfileAction}
 */
function setUserInfo(user: User) {
  appendApiImg(user);
  return {
    type: ProfilePageTypes.SET_USER_INFO,
    payload: user,
  };
}

/**
 * @param {number} id
 * @param {number} sign
 * @param {number} newLikesNum
 * @return {ProfileAction}
 */
function like(id: number, sign: number, newLikesNum: number) {
  return {
    type: CommonTypes.LIKE_CARD,
    payload: {id, sign, likes: newLikesNum},
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
