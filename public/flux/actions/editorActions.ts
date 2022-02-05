import {EditorTypes, CommonTypes} from '../types';
import {EditorAction} from '../reducers/editorReducer';
import {Article} from '../reducers/readerReducer';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
//  EditorActions
// ////////////////

// /**
//  * @return {EditorAction}
//  */
// function template(): EditorAction {
//   return {
//     type: EditorTypes,
//   };
// }

/**
 * @param {string} id
 * @return {EditorAction}
 */
function clearArticle(): EditorAction {
  return {
    type: EditorTypes.CLEAR_ARTICLE,
  };
}

/**
 * @return {EditorAction}
 */
function createArticle(): EditorAction {
  return {
    type: EditorTypes.CREATE_ARTICLE,
  };
}

/**
 * previewUrl кладешь опционально, если менял картинку.
 * @param {number} id
 * @param {Article} article
 * @return {EditorAction}
 */
function editArticle(id: number, article: Article): EditorAction {
  appendApiImg(article);
  appendApiImg(article.author);
  return {
    type: EditorTypes.EDIT_EXISTING_ARTICLE,
    payload: {
      id,
      ...article,
      tags: Array.isArray(article.tags) ? article.tags : [],
    },
  };
}

/**
 * @param {number} id - id, присвоенный записи на сервере
 * @return {EditorAction}
 */
function publishArticle(id: number): EditorAction {
  return {
    type: EditorTypes.PUBLISH_ARTICLE,
    payload: {id},
  };
}

/**
 * @param {number} id - id, присвоенный записи на сервере
 * @return {EditorAction}
 */
function deleteArticle(id: number): EditorAction {
  return {
    type: CommonTypes.DELETE_CARD,
    payload: id,
  };
}

/**
 * @param {string} title
 * @return {EditorAction}
 */
function saveTitle(title: string): EditorAction {
  return {
    type: EditorTypes.SAVE_TITLE,
    payload: title,
  };
}

/**
 * @param {string} text
 * @return {EditorAction}
 */
function saveText(text: string): EditorAction {
  return {
    type: EditorTypes.SAVE_TEXT,
    payload: text,
  };
}

/**
 * @param {string} tag
 * @return {EditorAction}
 */
function removeTag(tag: string): EditorAction {
  return {
    type: EditorTypes.REMOVE_TAG,
    payload: tag,
  };
}

/**
 * @param {string} tag
 * @return {EditorAction}
 */
function appendTag(tag: string): EditorAction {
  return {
    type: EditorTypes.APPEND_TAG,
    payload: tag,
  };
}

/**
 * @param {string} url присвоенный записи в браузере
 * @return {EditorAction}
 */
function saveImg(url: string): EditorAction {
  return {
    type: EditorTypes.SAVE_PREVIEW,
    payload: url,
  };
}

/**
 * @return {EditorAction}
 */
function clearImg(): EditorAction {
  return {
    type: EditorTypes.SAVE_PREVIEW,
    payload: '',
  };
}

/**
 * @param {string} category
 * @return {EditorAction}
 */
function saveCategory(category: string): EditorAction {
  return {
    type: EditorTypes.SAVE_CATEGORY,
    payload: category,
  };
}

/**
 * @return {EditorAction}
 */
function clearCategory(): EditorAction {
  return {
    type: EditorTypes.SAVE_CATEGORY,
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
