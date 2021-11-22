import {readerTypes} from '../types.js';
import {appentApiImg} from '../common/utils.js';

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
  appentApiImg(article);
  appentApiImg(article.author);
  return {
    type: readerTypes.SAVE_ARTICLE,
    payload: article,
  };
}

/**
 * @param {Object} article
 * @property {string} id
 * @property {string?} title
 * @property {Array<string>?} tags
 * @property {number?} datetime
 * @property {Object?} author
 * @property {number?} likes
 * @property {number?} comments
 * @property {string?} previewUrl
 * @return {Action}
 */
function setArticleLoading(article) {
  appentApiImg(article);
  appentApiImg(article.author);
  return {
    type: readerTypes.SET_ARTICLE_LOADING,
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
    payload: id,
  };
}

const readerActions = {
  saveArticle,
  openArticle,
  setArticleLoading,
};

export default readerActions;
