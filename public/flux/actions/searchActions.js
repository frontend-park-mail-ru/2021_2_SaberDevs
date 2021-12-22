import {searchTypes} from '../types.js';
import {appendApiImg} from '../../common/transformApi.js';

// ////////////////
// searchPageActions
// ////////////////

/**
 * @param {string} idLastLoaded
 * @param {Array<Object>} cards
 * @return {Action}
 */
function saveNewCards(idLastLoaded, cards) {
  cards.forEach((card) => {
    // только для статей
    if (!'login' in card) {
      appendApiImg(card.author);
    }
    appendApiImg(card);
  });
  return {
    type: searchTypes.SAVE_NEW_CARDS,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @param {string} group
 * @param {string} description
 * @return {Action}
 */
function setSearchGroup(group, description = '') {
  return {
    type: searchTypes.SET_SEARCH_GROUP,
    payload: {group, description},
  };
}

/**
 * @param {string} value
 * @return {Action}
 */
function setSearchValue(value) {
  return {
    type: searchTypes.SET_SEARCH_VALUE,
    payload: value,
  };
}

/**
 * @return {Action}
 */
function setLoadingFlag() {
  return {
    type: searchTypes.SET_LOADING_FLAG,
  };
}

/**
 * @return {Action}
 */
function unsetLoadingFlag() {
  return {
    type: searchTypes.UNSET_LOADING_FLAG,
  };
}

/**
 * @return {Action}
 */
function forbidCardsLoading() {
  return {
    type: searchTypes.FORBID_CARDS_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function allowCardsLoading() {
  return {
    type: searchTypes.ALLOW_CARDS_UPLOADING,
  };
}

/**
 * @return {Action}
 */
function clearCards() {
  return {
    type: searchTypes.CLEAR_CARDS,
  };
}

/**
 * @return {Action}
 */
function askNewCards() {
  return {
    type: searchTypes.ASK_NEW_CARDS,
  };
}

/**
 * @param {string} id
 * @return {Action}
 */
function deleteCard(id) {
  return {
    type: searchTypes.DELETE_CARD,
    payload: id,
  };
}

/**
 * @param {string} id
 * @param {number} sign
 * @param {number} newLikesNum
 * @return {Action}
 */
function like(id, sign, newLikesNum) {
  return {
    type: searchTypes.LIKE,
    payload: {id: id + '', sign, likes: newLikesNum},
  };
}

/**
 * @return {Action}
 */
function showEmptyFeed() {
  return {
    type: searchTypes.SHOW_EMPTY_FEED,
  };
}

/**
 * @return {Action}
 */
function submit() {
  return {
    type: searchTypes.SUBMIT,
  };
}

/**
 * @return {Action}
 */
function submitOnHeader() {
  return {
    type: searchTypes.SUBMIT_ON_HEADER,
  };
}

/**
 * @return {Action}
 */
function upload() {
  return {
    type: searchTypes.REQUEST,
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
