import {articleEditTypes} from '../types.js';

const InitialArticleEditState = {
  isEdit: false,
  // Article
  id: 0,
  title: '',
  text: '',
  tags: ['test', 'Edit'],
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function articleEditReducer(
    state = InitialArticleEditState,
    action,
) {
  switch (action.type) {
    case articleEditTypes.APPEND_TAG:
      return {
        ...state,
        // TODO: appendTag
      };
    case articleEditTypes.REMOVE_TAG:
      return {
        ...state,
        // TODO: remove Tag
      };
    case articleEditTypes.EDIT_EXISTING_ARTICLE:
      return {
        ...state,
        isEdit: true,
        id: action.payload.id,
        title: action.payload.title,
        text: action.payload.text,
        tags: action.payload.tags,
      };
    case articleEditTypes.CREATE_ARTICLE:
      return InitialArticleEditState;
    case articleEditTypes.SAVE_TEXT:
      return {
        ...state,
        title: action.payload.title,
        text: action.payload.text,
      };
  }
  return state;
}
