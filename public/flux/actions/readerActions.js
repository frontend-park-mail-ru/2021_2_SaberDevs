import {readerTypes} from '../types.js';
import {appendApiImg} from '../../common/utils.js';

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
  appendApiImg(article);
  appendApiImg(article.author);
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
  appendApiImg(article);
  if ('avatar' in article) {
    appendApiImg(article.author);
  }
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

/**
 * @param {number} id - id, присвоенный записи на сервере
 * @param {Array<Comment>} comments
 * @return {Action}
 */
function saveArticleComments(id, comments) {
  if (!Array.isArray(comments)) {
    console.warn('API error. Server returned ', typeof comments,
        'instead of comments');
    comments = [];
  }
  if (!comments) {
    comments = [];
  }
  return {
    type: readerTypes.SAVE_ARTICLE_COMMENTS,
    payload: {id, comments},
  };
}

const readerActions = {
  saveArticle,
  openArticle,
  setArticleLoading,
  saveArticleComments,
};

export default readerActions;
