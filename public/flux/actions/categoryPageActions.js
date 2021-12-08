import {categoryPageTypes} from '../types.js';
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
 * @param {string} id
 * @return {Action}
 */
function deleteArticle(id) {
  return {
    type: categoryPageTypes.DELETE_CARD,
    payload: id,
  };
}


/**
 * @param {string} category
 * @return {Action}
 */
function selectCategory(category) {
  return {
    type: categoryPageTypes.SELECT_CATEGORY,
    payload: category,
  };
}

/**
 * @return {Action}
 */
function clearSelectedCategory() {
  return {
    type: categoryPageTypes.SELECT_CATEGORY,
    payload: '',
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
};

export default categoryPageActions;
