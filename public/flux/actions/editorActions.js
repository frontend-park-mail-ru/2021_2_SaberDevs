import {editorTypes} from '../types.js';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
//  EditorActions
// ////////////////

// /**
//  * @return {Action}
//  */
// function template() {
//   return {
//     type: editorTypes,
//   };
// }

/**
 * @param {string} id
 * @return {Action}
 */
function clearArticle() {
  return {
    type: editorTypes.CLEAR_ARTICLE,
  };
}

/**
 * @return {Action}
 */
function createArticle() {
  return {
    type: editorTypes.CREATE_ARTICLE,
  };
}

/**
 * img кладешь опционально, если менял картинку.
 * @param {number} id
 * @param {Object?} article
 * @property {string} title
 * @property {string} text
 * @property {Array<string>} tags
 * @property {string}  category
 * @property {string}  img
 * @property {string?} dateTime
 * @property {string?} author
 * @property {number?} likes
 * @property {number?} comments
 * @return {Action}
 */
function editArticle(id, article) {
  appendApiImg(article);
  appendApiImg(article.author);
  return {
    type: editorTypes.EDIT_EXISTING_ARTICLE,
    payload: {
      id,
      ...article,
      tags: Array.isArray(article.tags) ? article.tags : [],
    },
  };
}

/**
 * @param {number} id - id, присвоенный записи на сервере
 * @return {Action}
 */
function publishArticle(id) {
  return {
    type: editorTypes.PUBLISH_ARTICLE,
    payload: {id},
  };
}

/**
 * @param {string} id - id, присвоенный записи на сервере
 * @return {Action}
 */
function deleteArticle(id) {
  return {
    type: editorTypes.DELETE_ARTICLE,
    payload: {id},
  };
}

/**
 * @param {string} title
 * @return {Action}
 */
function saveTitle(title) {
  return {
    type: editorTypes.SAVE_TITLE,
    payload: title,
  };
}

/**
 * @param {string} text
 * @return {Action}
 */
function saveText(text) {
  return {
    type: editorTypes.SAVE_TEXT,
    payload: text,
  };
}

/**
 * @param {string} tag
 * @return {Action}
 */
function removeTag(tag) {
  return {
    type: editorTypes.REMOVE_TAG,
    payload: tag,
  };
}

/**
 * @param {string} tag
 * @return {Action}
 */
function appendTag(tag) {
  return {
    type: editorTypes.APPEND_TAG,
    payload: tag,
  };
}

/**
 * @param {string} url присвоенный записи в браузере
 * @return {Action}
 */
function saveImg(url) {
  return {
    type: editorTypes.SAVE_PREVIEW,
    payload: url,
  };
}

/**
 * @return {Action}
 */
function clearImg() {
  return {
    type: editorTypes.SAVE_PREVIEW,
    payload: '',
  };
}

/**
 * @param {string} category
 * @return {Action}
 */
function saveCategory(category) {
  return {
    type: editorTypes.SAVE_CATEGORY,
    payload: category,
  };
}

/**
 * @return {Action}
 */
function clearCategory() {
  return {
    type: editorTypes.SAVE_CATEGORY,
    payload: '',
  };
}

const editorActions = {
  createArticle,
  clearArticle,
  editArticle,
  publishArticle,
  deleteArticle,
  appendTag,
  removeTag,
  saveImg,
  clearImg,
  saveTitle,
  saveText,
  saveCategory,
  clearCategory,
};

export default editorActions;
