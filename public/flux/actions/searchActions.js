import {searchTypes} from '../types.js';

// ////////////////
// searchPageActions
// ////////////////

/**
 * @param {string} idLastLoaded
 * @param {Array<Object>} cards
 * @return {Action}
 */
function saveNewCards(idLastLoaded, cards) {
  return {
    type: searchTypes.SAVE_NEW_CARDS,
    payload: {idLastLoaded, cards},
  };
}

/**
 * @param {string} group
 * @return {Action}
 */
function setSearchGroup(group) {
  return {
    type: searchTypes.SET_SEARCH_GROUP,
    payload: group,
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
};

export default searchActions;
