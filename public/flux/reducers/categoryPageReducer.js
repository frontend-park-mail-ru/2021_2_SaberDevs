import {CategoryPageTypes, FluxStateObject, FluxAction} from '../types';

const endOfFeedMarkerID = 'end';

/**
 * Объект состояния на главной странице
 * @typedef {Object} CategoryPageState
 *                                    вызовет подгрузку новостей
 * @property {string} idLastLoaded  - ID последней загруженной карточки
 * @property {boolean} isLoading    - Идет ли загрузка сейчас. true запрещает
 *                                    отправку запросов на обновлении ленты,
 *                                    чтобы не спамить сервер
 * @property {number} lastScrollPos - Позиция скролла при покидании mainPage
 * @property {boolean} isEndFound  - Запрещает загрузку при обнаружении конца
 *                                    ленты, чтобы не спамить сервер.
 *                                    Сбразывется через resetDoNotUploadTime мс
 * @property {Array.NewsCard} cards - Массив загруженных карточек для
 *                                    восстановления состояния при возвращении
 *                                    на MainPage
 */
const InitialCategoryPageState = {
  currentCategory: '',            // категория, по которой фильтруются записи
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  lastScrollPos: 0,              // скрол для возврата к той же записи
  cards: [],                     // массив загруженных новостей
  isEndFound: false,
  tags: {
    // category: {
    //  tag1: false,
    //  tag2: true,
    // }
  },
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function categoryPageReducer(
    state = InitialCategoryPageState,
    action,
) {
  switch (action.type) {
    case CategoryPageTypes.SET_CATEGORY_ARTICLES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case CategoryPageTypes.UNSET_CATEGORY_ARTICLES_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case CategoryPageTypes.FORBID_CATEGORY_ARTICLES_UPLOADING:
      return {
        ...state,
        isEndFound: true,
      };
    case CategoryPageTypes.ALLOW_CATEGORY_ARTICLES_UPLOADING:
      return {
        ...state,
        isEndFound: false,
      };
    case CategoryPageTypes.SAVE_NEW_CATEGORY_ARTICLES:
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
    case CategoryPageTypes.DELETE_CARD: {
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
    case CategoryPageTypes.CLEAR_CATEGORY_ARTICLES:
      return {
        ...state,
        cards: [],
        isLoading: false,
        idLastLoaded: '',
        lastScrollPos: 0,
        isEndFound: false,
      };
    case CategoryPageTypes.SELECT_CATEGORY:
      return {
        ...state,
        currentCategory: action.payload,
      };
    case CategoryPageTypes.LIKE:
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
  }
  return state;
}
