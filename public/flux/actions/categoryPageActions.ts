import {CategoryPageTypes, CommonTypes} from '../types';
import {Article} from '../reducers/readerReducer';
import {CategoryPageAction} from '../reducers/categoryPageReducer';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
//  CategoryPageActions
// ////////////////

/**
 * @param {number} idLastLoaded
 * @param {Array<Article>} cards
 * @return {CategoryPageAction}
 */
function saveNewCategoryArticles(idLastLoaded: number, cards: Article[]): CategoryPageAction {
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
 * @return {CategoryPageAction}
 */
function clearCategoryArticles(): CategoryPageAction {
  return {
    type: CategoryPageTypes.CLEAR_CATEGORY_ARTICLES,
  };
}

/**
 * @return {CategoryPageAction}
 */
function setCategoryArticlesLoadingFlag(): CategoryPageAction {
  return {
    type: CategoryPageTypes.SET_CATEGORY_ARTICLES_LOADING,
  };
}

/**
 * @return {CategoryPageAction}
 */
function unsetCategoryArticlesLoadingFlag(): CategoryPageAction {
  return {
    type: CategoryPageTypes.UNSET_CATEGORY_ARTICLES_LOADING,
  };
}

/**
 * @return {CategoryPageAction}
 */
function forbidCategoryArticlesLoading(): CategoryPageAction {
  return {
    type: CategoryPageTypes.FORBID_CATEGORY_ARTICLES_UPLOADING,
  };
}

/**
 * @return {CategoryPageAction}
 */
function allowCategoryArticlesLoading(): CategoryPageAction {
  return {
    type: CategoryPageTypes.ALLOW_CATEGORY_ARTICLES_UPLOADING,
  };
}

/**
 * @return {CategoryPageAction}
 */
function askNewCategoryArticles(): CategoryPageAction {
  return {
    type: CategoryPageTypes.ASK_NEW_CATEGORY_ARTICLES,
  };
}

/**
 * @param {number} id
 * @return {CategoryPageAction}
 */
function deleteArticle(id: number): CategoryPageAction {
  return {
    type: CommonTypes.DELETE_CARD,
    payload: id,
  };
}


/**
 * @param {string} category
 * @return {CategoryPageAction}
 */
function selectCategory(category: string): CategoryPageAction {
  return {
    type: CategoryPageTypes.SELECT_CATEGORY,
    payload: category,
  };
}

/**
 * @return {CategoryPageAction}
 */
function clearSelectedCategory(): CategoryPageAction {
  return {
    type: CategoryPageTypes.SELECT_CATEGORY,
    payload: '',
  };
}

/**
 * @param {number} id
 * @param {number} sign
 * @param {number} newLikesNum
 * @return {CategoryPageAction}
 */
function like(id: number, sign: number, newLikesNum: number): CategoryPageAction {
  return {
    type: CommonTypes.LIKE_CARD,
    payload: {id, sign, likes: newLikesNum},
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
