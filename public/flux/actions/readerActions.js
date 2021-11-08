import {readerTypes} from '../types.js';

// ////////////////
//  ReaderActions
// ////////////////

/**
 * @param {Object} article
 * @property {string} id
 * @property {string} title
 * @property {string} text
 * @property {Array<string>} tags
 * @property {number} datetime
 * @property {Object} author
 * @property {number} likes
 * @property {number} comments
 * @property {string} previewUrl
 * @return {Action}
 */
function saveArticle(article) {
  return {
    type: readerTypes.SAVE_ARTICLE,
    payload: article,
  };
}

/**
 * @param {number} id - id, присвоенный записи на сервере
 * @return {Action}
 */
function openArticle(id) {
  return {
    type: readerTypes.OPEN_ARTICLE,
    payload: {id},
  };
}

const readerActions = {
  saveArticle,
  openArticle,
};

export default readerActions;
