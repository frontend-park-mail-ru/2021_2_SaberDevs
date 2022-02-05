import {StreamTypes, FluxStateObject, FluxAction} from '../types';
import {Comment} from './readerReducer';

export interface StreamStateObject extends FluxStateObject {
  comments: Comment[],
}

export type StreamAction = FluxAction<StreamTypes>;

const InitialStreamState: StreamStateObject = {
  comments: [],                     // массив загруженных новостей
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function streamReducer(state: StreamStateObject = InitialStreamState, action: StreamAction): StreamStateObject {
  switch (action.type) {
    case StreamTypes.SAVE_NEW_COMMENTS:
      const comments = action.payload;
      if (comments.length === 0) {
        return state;
      }
      return {
        ...state,
        comments: state.comments.concat(comments),
      };
    case StreamTypes.CLEAR_COMMENTS:
      return {
        ...state,
        comments: [],
      };
    case StreamTypes.ASK_NEW_COMMENTS:  // UNUSED
      return state;
  }
  return state;
}
