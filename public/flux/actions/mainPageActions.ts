import {MainPageTypes, CommonTypes} from '../types';
import {MainPageAction} from '../reducers/mainPageReducer';
import {Article} from '../reducers/readerReducer';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
// mainPageActions
// ////////////////

/**
 * @param {number} idLastLoaded
 * @param {Array<Article>} cards
 * @return {MainPageAction}
 */
function saveNewCards(idLastLoaded: number, cards: Article[]): MainPageAction {
  cards.forEach((card) => {
    appendApiImg(card);
    appendApiImg(card.author);
  });
  return {
    type: MainPageTypes.SAVE_NEW_CARDS,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @return {MainPageAction}
 */
function setLoadingFlag(): MainPageAction {
  return {
    type: MainPageTypes.SET_LOADING_FLAG,
  };
}

/**
 * @return {MainPageAction}
 */
function unsetLoadingFlag(): MainPageAction {
  return {
    type: MainPageTypes.UNSET_LOADING_FLAG,
  };
}

/**
 * @return {MainPageAction}
 */
function forbidCardsLoading(): MainPageAction {
  return {
    type: MainPageTypes.FORBID_CARDS_UPLOADING,
  };
}

/**
 * @return {MainPageAction}
 */
function allowCardsLoading(): MainPageAction {
  return {
    type: MainPageTypes.ALLOW_CARDS_UPLOADING,
  };
}

/**
 * @return {MainPageAction}
 */
function clearCards(): MainPageAction {
  return {
    type: MainPageTypes.CLEAR_CARDS,
  };
}

/**
 * @return {MainPageAction}
 */
function askNewCards(): MainPageAction {
  return {
    type: MainPageTypes.ASK_NEW_CARDS,
  };
}

/**
 * @param {number} id
 * @return {MainPageAction}
 */
function deleteCard(id: number): MainPageAction {
  return {
    type: CommonTypes.DELETE_CARD,
    payload: id,
  };
}

/**
 * @param {number} id
 * @param {number} sign
 * @param {number} newLikesNum
 * @return {MainPageAction}
 */
function like(id: number, sign: number, newLikesNum: number): MainPageAction {
  return {
    type: CommonTypes.LIKE_CARD,
    payload: {id, sign, likes: newLikesNum},
  };
}

const mainPageActions = {
  askNewCards,
  saveNewCards,
  clearCards,
  setLoadingFlag,
  unsetLoadingFlag,
  forbidCardsLoading,
  allowCardsLoading,
  deleteCard,
  like,
};

export default mainPageActions;
