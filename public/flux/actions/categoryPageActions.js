import {categoryPageTypes} from '../types.js';

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
function addTag(tag) {
  return {
    type: categoryPageTypes.ADD_TAG,
    payload: tag,
  };
}

/**
 * @param {string} tag
 * @return {Action}
 */
function removeTag() {
  return {
    type: categoryPageTypes.REMOVE_TAG,
    payload: tag,
  };
}

/**
 * @return {Action}
 */
function clearTags() {
  return {
    type: categoryPageTypes.CLEAR_TAGS,
  };
}

/**
 * @param {Object<Array<string>>} categories
 * @return {Action}
 */
function loadTags(categories) {
  return {
    type: categoryPageTypes.LOAD_TAGS,
    payload: categories,
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
    type: categoryPageTypes.CLEAR_CATEGORY,
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
  addTag,
  removeTag,
  clearTags,
  loadTags,
  selectCategory,
  clearSelectedCategory,
};

export default categoryPageActions;