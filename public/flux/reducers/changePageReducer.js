import {changePageTypes} from '../types.js';

const InitialPageState = {
  page: 'main',
  docTitle: 'SaberProject',
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function changePageReducer(state = InitialPageState, action) {
  switch (action.type) {
    case changePageTypes.CHANGE_PAGE:
      document.title = action.payload.docTitle;
      return {
        ...state,
        page: action.payload.page,
        docTitle: action.payload.docTitle,
      };
    case changePageTypes.CHANGE_DOC_TITLE:
      document.title = action.payload.docTitle;
      return {
        ...state,
        docTitle: action.payload.docTitle,
      };
  }
  return state;
}
