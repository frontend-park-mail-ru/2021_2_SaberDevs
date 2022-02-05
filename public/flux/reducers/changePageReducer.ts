import {ChangePageTypes, FluxStateObject, FluxAction} from '../types';



export interface ChangePageStateObject extends FluxStateObject {
  page: string,
  docTitle: string,
};

const InitialPageState: ChangePageStateObject = {
  page: 'main',
  docTitle: 'SaberProject',
};

export type ChangePageAction = FluxAction<ChangePageTypes>;

/**
 * @param {ChangePageStateObject} state
 * @param {Action} action
 * @return {ChangePageStateObject}
 */
export default function changePageReducer(state: ChangePageStateObject = InitialPageState, action: ChangePageAction): ChangePageStateObject {
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
