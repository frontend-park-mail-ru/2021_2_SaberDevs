import {SearchTypes, CommonTypes} from '../types';
import {SearchAction} from '../reducers/searchPageReducer';
import {appendApiImg} from '../../common/transformApi.js';
import {Article, ArticleId} from '../../common/types';

// ////////////////
// searchPageActions
// ////////////////

/**
 * @param {string} idLastLoaded
 * @param {Array<Article>} cards
 * @return {SearchAction}
 */
function saveNewCards(idLastLoaded: ArticleId, cards: Article[]): SearchAction {
  cards.forEach((card) => {
    // только для статей
    if (!('login' in card)) {
      appendApiImg(card.author);
    }
    appendApiImg(card);
  });
  return {
    type: SearchTypes.SAVE_NEW_CARDS,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @param {string} group
 * @param {string} description
 * @return {SearchAction}
 */
function setSearchGroup(group: string, description: string = ''): SearchAction {
  return {
    type: SearchTypes.SET_SEARCH_GROUP,
    payload: {group, description},
  };
}

/**
 * @param {string} value
 * @return {SearchAction}
 */
function setSearchValue(value: string): SearchAction {
  return {
    type: SearchTypes.SET_SEARCH_VALUE,
    payload: value,
  };
}

/**
 * @return {SearchAction}
 */
function setLoadingFlag(): SearchAction {
  return {
    type: SearchTypes.SET_LOADING_FLAG,
  };
}

/**
 * @return {SearchAction}
 */
function unsetLoadingFlag(): SearchAction {
  return {
    type: SearchTypes.UNSET_LOADING_FLAG,
  };
}

/**
 * @return {SearchAction}
 */
function forbidCardsLoading(): SearchAction {
  return {
    type: SearchTypes.FORBID_CARDS_UPLOADING,
  };
}

/**
 * @return {SearchAction}
 */
function allowCardsLoading(): SearchAction {
  return {
    type: SearchTypes.ALLOW_CARDS_UPLOADING,
  };
}

/**
 * @return {SearchAction}
 */
function clearCards(): SearchAction {
  return {
    type: SearchTypes.CLEAR_CARDS,
  };
}

/**
 * @return {SearchAction}
 */
function askNewCards(): SearchAction {
  return {
    type: SearchTypes.ASK_NEW_CARDS,
  };
}

/**
 * @param {number} id
 * @return {SearchAction}
 */
function deleteCard(id: number): SearchAction {
  return {
    type: CommonTypes.DELETE_CARD,
    payload: id,
  };
}

/**
 * @param {number} id
 * @param {number} sign
 * @param {number} newLikesNum
 * @return {Action}
 */
function like(id: number, sign: number, newLikesNum: number): SearchAction {
  return {
    type: CommonTypes.LIKE_CARD,
    payload: {id: id + '', sign, likes: newLikesNum},
  };
}

/**
 * @return {SearchAction}
 */
function showEmptyFeed(): SearchAction {
  return {
    type: SearchTypes.SHOW_EMPTY_FEED,
  };
}

/**
 * @return {SearchAction}
 */
function submit(): SearchAction {
  return {
    type: SearchTypes.SUBMIT,
  };
}

/**
 * @return {SearchAction}
 */
function submitOnHeader(): SearchAction {
  return {
    type: SearchTypes.SUBMIT_ON_HEADER,
  };
}

/**
 * @return {SearchAction}
 */
function upload(): SearchAction {
  return {
    type: SearchTypes.REQUEST,
  };
}

const searchActions = {
  askNewCards,
  saveNewCards,
  clearCards,
  setLoadingFlag,
  unsetLoadingFlag,
  forbidCardsLoading,
  allowCardsLoading,
  setSearchGroup,
  setSearchValue,
  deleteCard,
  like,
  showEmptyFeed,
  submit,
  submitOnHeader,
  upload,
};

export default searchActions;
