import {searchTypes} from '../types.js';

const endOfFeedMarkerID = 'end';

const InitialSearchState = {
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  lastScrollPos: 0,              // скрол для возврата к той же записи
  cards: [],                     // массив загруженных новостей
  isEndFound: false,
  value: '',
  group: 'articles',
  description: 'Статьи',
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function searchPageReducer(state = InitialSearchState, action) {
  switch (action.type) {
    case searchTypes.SET_SEARCH_GROUP:
      return {
        ...state,
        group: action.payload.group,
        description: action.payload.description,
      };
    case searchTypes.SET_LOADING_FLAG:
      return {
        ...state,
        isLoading: true,
      };
    case searchTypes.SET_SEARCH_VALUE:
      return {
        ...state,
        value: action.payload,
      };
    case searchTypes.FORBID_CARDS_UPLOADING:
      return {
        ...state,
        isEndFound: true,
      };
    case searchTypes.ALLOW_CARDS_UPLOADING:
      return {
        ...state,
        isEndFound: false,
      };
    case searchTypes.SAVE_NEW_CARDS:
      const cards = action.payload.cards;
      if (cards.length === 0) {
        return {
          ...state,
          isLoading: false,
        };
      }
      // запрещаем загрузку карточек, чтобы не спамить сервер
      const isEndFound = cards[cards.length - 1].id === endOfFeedMarkerID;
      if (isEndFound) {
        // Удаляем последнюю запись с end'ом
        cards.splice(cards.length - 1, 1);
      }
      return {
        ...state,
        isLoading: false,
        idLastLoaded: cards[cards.length - 1]?.id || state.idLastLoaded,
        cards: state.cards.concat(cards),
        isEndFound,
      };
    case searchTypes.DELETE_CARD: {
      const idx = state.cards.findIndex((card) => card.id === action.payload);
      if (idx !== -1) {
        return {
          ...state,
          cards: state.cards.splice(idx),
        };
      } else {
        return state;
      }
    }
    case searchTypes.CLEAR_CARDS:
      return {
        ...state,
        cards: [],
        isLoading: false,
        idLastLoaded: '',
        lastScrollPos: 0,
        isEndFound: false,
      };
  }
  return state;
}
