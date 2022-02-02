import {StreamTypes} from '../types';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
// streamActions
// ////////////////

/**
 * @param {Array<Object>} comments
 * @return {Action}
 */
function saveNewComments(comments) {
  comments.forEach((comment) => {
    appendApiImg(comment.author);
  });
  return {
    type: StreamTypes.SAVE_NEW_COMMENTS,
    payload: comments,
  };
}

/**
 * @return {Action}
 */
function clearComments() {
  return {
    type: StreamTypes.CLEAR_COMMENTS,
  };
}

/**
 * @return {Action}
 */
function askNewComments() {
  return {
    type: StreamTypes.ASK_NEW_COMMENTS,
  };
}

const streamActions = {
  askNewComments,
  saveNewComments,
  clearComments,
};

export default streamActions;
