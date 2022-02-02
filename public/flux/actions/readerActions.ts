import {ReaderTypes, CommonTypes} from '../types';
import {ReaderAction, Article, Comment} from '../reducers/readerReducer';
import {appendApiImg} from '../../common/transformApi.js';

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
 * @return {ReaderAction}
 */
function saveArticle(article: Article): ReaderAction {
  appendApiImg(article);
  appendApiImg(article.author);
  return {
    type: ReaderTypes.SAVE_ARTICLE,
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
 * @return {ReaderAction}
 */
function setArticleLoading(article: Article): ReaderAction {
  appendApiImg(article);
  if ('avatar' in article) {
    appendApiImg(article.author);
  }
  return {
    type: ReaderTypes.SET_ARTICLE_LOADING,
    payload: article,
  };
}

/**
 * @param {number} id - id, присвоенный записи на сервере
 * @return {ReaderAction}
 */
function openArticle(id): ReaderAction {
  return {
    type: ReaderTypes.OPEN_ARTICLE,
    payload: id,
  };
}

/**
 * @param {number} id - id, присвоенный записи на сервере
 * @param {Array<Comment>} comments
 * @return {ReaderAction}
 */
function saveArticleComments(id, comments): ReaderAction {
  if (!Array.isArray(comments)) {
    console.warn('API error. Server returned ', typeof comments,
        'instead of comments');
    comments = [];
  }
  if (!comments) {
    comments = [];
  }
  return {
    type: ReaderTypes.SAVE_ARTICLE_COMMENTS,
    payload: {id, comments},
  };
}

/**
 * @param {number} id - id, присвоенный записи на сервере
 * @param {string} text
 * @return {ReaderAction}
 */
function editArticleComment(id: number, text: string): ReaderAction {
  return {
    type: ReaderTypes.EDIT_ARTICLE_COMMENT,
    payload: {id, text},
  };
}

/**
 * @param {number} parentId - id, присвоенный записи на сервере
 * @param {Comment} answer
 * @return {ReaderAction}
 */
function addAnswer(parentId: number, answer: Comment): ReaderAction {
  return {
    type: ReaderTypes.ADD_COMMENT_ANSWER,
    payload: {parentId, answer},
  };
}

/**
 * @param {Comment} comment
 * @return {ReaderAction}
 */
function addComment(comment: Comment): ReaderAction {
  return {
    type: ReaderTypes.ADD_NEW_COMMENT,
    payload: comment,
  };
}

/**
 * @param {number} id
 * @param {number} sign
 * @param {number} newLikesNum
 * @return {ReaderAction}
 */
function like(id, sign, newLikesNum): ReaderAction {
  return {
    type: CommonTypes.LIKE_CARD,
    payload: {id, sign, likes: newLikesNum},
  };
}

/**
 * @param {number} id
 * @param {number} sign
 * @param {number} newLikesNum
 * @return {ReaderAction}
 */
function likeComment(id, sign, newLikesNum): ReaderAction {
  return {
    type: CommonTypes.LIKE_COMMENT,
    payload: {id, sign, likes: newLikesNum},
  };
}

const readerActions = {
  saveArticle,
  openArticle,
  setArticleLoading,
  saveArticleComments,
  editArticleComment,
  addAnswer,
  addComment,
  like,
  likeComment,
};

export default readerActions;
