import {ChangePageTypes, FluxStateObject, FluxAction} from '../types';

const InitialPageState = {
  page: 'main',
  docTitle: 'SaberProject',
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function changePageReducer(state: FluxStateObject = InitialPageState, action: FluxAction): FluxStateObject {
  switch (action.type) {
    case ChangePageTypes.CHANGE_PAGE:
      document.title = action.payload.docTitle;
      // очень хитро кидаю предыдущую страницу
      action.payload.prev = state.page;
      return {
        ...state,
        page: action.payload.page,
        docTitle: action.payload.docTitle,
      };
    case ChangePageTypes.CHANGE_DOC_TITLE:
      document.title = action.payload.docTitle;
      return {
        ...state,
        docTitle: action.payload.docTitle,
      };
  }
  return state;
}
