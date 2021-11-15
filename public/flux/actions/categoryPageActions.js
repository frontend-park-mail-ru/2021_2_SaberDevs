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
 * @param {string} category
 * @return {Action}
 */
function setCategory(category) {
  return {
    type: categoryPageTypes.SET_CATEGORY,
    payload: category,
  };
}

/**
 * @return {Action}
 */
function resetCategory() {
  return {
    type: categoryPageTypes.RESET_CATEGORY,
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

// TODO: разобраться с категорями
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

const categoryPageActions = {
  setCategoryArticlesLoadingFlag,
  unsetCategoryArticlesLoadingFlag,
  forbidCategoryArticlesLoading,
  allowCategoryArticlesLoading,
  askNewCategoryArticles,
  saveNewCategoryArticles,
  clearCategoryArticles,
  setCategory,
  resetCategory,
  addTag,
  removeTag,
  clearTags,
  loadTags,
  // TODO: разобраться с категорями
  selectCategoryTag,
  clearSelectedCategoryTags,
};

export default categoryPageActions;
