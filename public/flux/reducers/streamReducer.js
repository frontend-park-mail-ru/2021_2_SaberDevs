import {streamTypes} from '../types.js';

const InitialStreamState = {
  comments: [],                     // массив загруженных новостей
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function streamReducer(state = InitialStreamState, action) {
  switch (action.type) {
    case streamTypes.SAVE_NEW_COMMENTS:
      const comments = action.payload;
      if (comments.length === 0) {
        return state;
      }
      return {
        ...state,
        comments: state.comments.concat(comments),
      };
    case streamTypes.CLEAR_COMMENTS:
      return {
        ...state,
        comments: [],
      };
    case streamTypes.ASK_NEW_COMMENTS:  // UNUSED
      return state;
  }
  return state;
}
