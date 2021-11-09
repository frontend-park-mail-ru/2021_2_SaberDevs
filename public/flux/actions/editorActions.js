import {editorTypes} from '../types.js';

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
function clearArticle(id) {
  return {
    type: editorTypes.CLEAR_ARTICLE,
    payload: id,
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
 * Перерисовать главную страницу
 * @param {number} id
 * @param {Object?} article
 * @property {string} title
 * @property {string} text
 * @property {Array<string>?} tags
 * @property {number?} time
 * @property {string?} author
 * @property {number?} likes
 * @property {number?} comments
 * @return {Action}
 */
function editArticle(id, article) {
  return {
    type: editorTypes.EDIT_EXISTING_ARTICLE,
    payload: {
      id,
      ...article,
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
 * Перерисовать главную страницу
 * @param {number} id - id, полученный с сервера,
 *                      либо 0, если запись только создается
 * @param {Object?} article
 * @property {string} title
 * @property {string} text
 * @property {Array<string>?} tags
 * @property {number?} time
 * @property {string?} author
 * @property {number?} likes
 * @property {number?} comments
 * @return {Action}
 */
function saveArticle(id, article) {
  return {
    type: editorTypes.SAVE_ARTICLE,
    payload: {
      id,
      title: article.title,
      text: article.text,
    },
  };
}

const editorActions = {
  createArticle,
  clearArticle,
  editArticle,
  publishArticle,
  saveArticle,
};

export default editorActions;
