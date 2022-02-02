import {SearchTypes, FluxStateObject, FluxAction} from '../types';

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
export default function searchPageReducer(state: FluxStateObject = InitialSearchState, action: FluxAction): FluxStateObject {
  switch (action.type) {
    case SearchTypes.SET_SEARCH_GROUP:
      return {
        ...state,
        group: action.payload.group,
        description: action.payload.description,
      };
    case SearchTypes.SET_LOADING_FLAG:
      return {
        ...state,
        isLoading: true,
      };
    case SearchTypes.SET_SEARCH_VALUE:
      return {
        ...state,
        value: action.payload,
      };
    case SearchTypes.FORBID_CARDS_UPLOADING:
      return {
        ...state,
        isEndFound: true,
      };
    case SearchTypes.ALLOW_CARDS_UPLOADING:
      return {
        ...state,
        isEndFound: false,
      };
    case SearchTypes.SAVE_NEW_CARDS:
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
    case SearchTypes.DELETE_CARD: {
      const idx = state.cards.findIndex((card) => card.id === action.payload);
      if (idx !== -1) {
        return {
          ...state,
          cards: state.cards.slice(0, idx).concat(state.cards.slice(idx + 1)),
        };
      } else {
        return state;
      }
    }
    case SearchTypes.CLEAR_CARDS:
      return {
        ...state,
        cards: [],
        isLoading: false,
        idLastLoaded: '',
        lastScrollPos: 0,
        isEndFound: false,
      };
    case SearchTypes.LIKE:
      const idx = state.cards.findIndex((card) => card.id===action.payload.id);
      if (idx !== -1) {
        const likeCardCopy = JSON.parse(JSON.stringify(state.cards[idx]));
        if (likeCardCopy.liked ^ action.payload.sign === 0) {
          likeCardCopy.liked = 0; // отменили оценку
        } else {
          likeCardCopy.liked = action.payload.sign;
        }
        likeCardCopy.likes = action.payload.likes;
        return {
          ...state,
          cards: state.cards.slice(0, idx)
              .concat([likeCardCopy])
              .concat(state.cards.slice(idx + 1)),
        };
      } else {
        return state;
      }
    case SearchTypes.SHOW_EMPTY_FEED:
      return state;
    case SearchTypes.SUBMIT:
      return state;
    case SearchTypes.REQUEST:
      return state;
  }
  return state;
}
