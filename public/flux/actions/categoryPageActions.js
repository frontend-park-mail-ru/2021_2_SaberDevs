import {CategoryPageTypes} from '../types';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
//  CategoryPageActions
// ////////////////

/**
 * @param {string} idLastLoaded
 * @param {Array<Card>} cards
 * @return {Action}
 */
function saveNewCategoryArticles(idLastLoaded, cards) {
  cards.forEach((card) => {
    appendApiImg(card);
    appendApiImg(card.author);
  });
  return {
    type: CategoryPageTypes.SAVE_NEW_CATEGORY_ARTICLES,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @return {Action}
 */
function clearCategoryArticles() {
  return {
    type: CategoryPageTypes.CLEAR_CATEGORY_ARTICLES,
  };
}

/**
 * @return {Action}
 */
function setCategoryArticlesLoadingFlag() {
  return {
    type: CategoryPageTypes.SET_CATEGORY_ARTICLES_LOADING,
  };
}

/**
 * @return {Action}
 */
function unsetCategoryArticlesLoadingFlag() {
  return {
    type: CategoryPageTypes.UNSET_CATEGORY_ARTICLES_LOADING,
  };
}

/**
 * @return {Action}
 */
function forbidCategoryArticlesLoading() {
  return {
    type: CategoryPageTypes.FORBID_CATEGORY_ARTICLES_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function allowCategoryArticlesLoading() {
  return {
    type: CategoryPageTypes.ALLOW_CATEGORY_ARTICLES_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function askNewCategoryArticles() {
  return {
    type: CategoryPageTypes.ASK_NEW_CATEGORY_ARTICLES,
  };
}

/**
 * @param {string} id
 * @return {Action}
 */
function deleteArticle(id) {
  return {
    type: CategoryPageTypes.DELETE_CARD,
    payload: id,
  };
}


/**
 * @param {string} category
 * @return {Action}
 */
function selectCategory(category) {
  return {
    type: CategoryPageTypes.SELECT_CATEGORY,
    payload: category,
  };
}

/**
 * @return {Action}
 */
function clearSelectedCategory() {
  return {
    type: CategoryPageTypes.SELECT_CATEGORY,
    payload: '',
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
    type: CategoryPageTypes.LIKE,
    payload: {id: id + '', sign, likes: newLikesNum},
  };
}

const categoryPageActions = {
  setCategoryArticlesLoadingFlag,
  unsetCategoryArticlesLoadingFlag,
  forbidCategoryArticlesLoading,
  allowCategoryArticlesLoading,
  askNewCategoryArticles,
  saveNewCategoryArticles,
  clearCategoryArticles,
  selectCategory,
  clearSelectedCategory,
  deleteArticle,
  like,
};

export default categoryPageActions;
