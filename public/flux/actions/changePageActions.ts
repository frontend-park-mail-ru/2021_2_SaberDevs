import {ChangePageTypes} from '../types';
import {ChangePageAction} from '../reducers/changePageReducer';


// ////////////////
// changePageActions
// ////////////////

/**
 * @param {string} page
 * @param {string} docTitle
 * @return {ChangePageAction}
 */
 function changePage(page: string, docTitle: string): ChangePageAction {
  return {
    type: ChangePageTypes.CHANGE_PAGE,
    payload: {
      page,
      docTitle,
    },
  };
}

/**
 * @param {string} docTitle
 * @return {ChangePageAction}
 */
function changeDocTitle(docTitle: string): ChangePageAction {
  return {
    type: ChangePageTypes.CHANGE_DOC_TITLE,
    payload: {
      docTitle,
    },
  };
}

const changePageActions = {
  changePage,
  changeDocTitle,
};

export default changePageActions;
