import {streamTypes} from '../types.js';
import {appendApiImg} from '../../common/utils.js';

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
    type: streamTypes.SAVE_NEW_COMMENTS,
    payload: comments,
  };
}

/**
 * @return {Action}
 */
function clearComments() {
  return {
    type: streamTypes.CLEAR_COMMENTS,
  };
}

/**
 * @return {Action}
 */
function askNewComments() {
  return {
    type: streamTypes.ASK_NEW_COMMENTS,
  };
}

const streamActions = {
  askNewComments,
  saveNewComments,
  clearComments,
};

export default streamActions;
