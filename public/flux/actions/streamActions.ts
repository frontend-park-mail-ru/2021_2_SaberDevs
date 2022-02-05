import {StreamTypes} from '../types';
import {StreamAction} from '../reducers/streamReducer';
import {Comment} from '../reducers/readerReducer';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
// streamActions
// ////////////////

/**
 * @param {Array<Comment>} comments
 * @return {Action}
 */
function saveNewComments(comments: Comment[]): StreamAction {
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
function clearComments(): StreamAction {
  return {
    type: StreamTypes.CLEAR_COMMENTS,
  };
}

/**
 * @return {Action}
 */
function askNewComments(): StreamAction {
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
