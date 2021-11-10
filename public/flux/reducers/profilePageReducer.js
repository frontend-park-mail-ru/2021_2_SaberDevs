import {profilePageTypes} from '../types.js';

const endOfFeedMarkerID = 'end';

/**
 * Объект состояния для ленты
 * @typedef {Object} MainCardState
 * @property {boolean} isLoading    - Идет ли загрузка сейчас. true запрещает
 *                                    отправку запросов на обновлении ленты,
 *                                    чтобы не спамить сервер
 * @property {boolean} isEndFound  - Запрещает загрузку при обнаружении конца
 *                                    ленты, чтобы не спамить сервер.
 *                                    Сбразывется через resetDoNotUploadTime мс
 * @property {Array.NewsCard} cards - Массив загруженных карточек для
 *                                    восстановления состояния при возвращении
 *                                    на MainPage
 */
const InitialProfilePageState = {
  user: {
    login: '',
  },
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  cards: [],                     // массив загруженных новостей
  isEndFound: false,
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function profilePageReducer(
    state = InitialProfilePageState,
    action,
) {
  switch (action.type) {
    case profilePageTypes.SET_USER_ARTICLES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case profilePageTypes.FORBID_USER_ARTICLES_UPLOADING:
      return {
        ...state,
        isEndFound: true,
      };
    case profilePageTypes.ALLOW_USER_ARTICLES_UPLOADING:
      return {
        ...state,
        isEndFound: false,
      };
    case profilePageTypes.SAVE_NEW_USER_ARTICLES:
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
    case profilePageTypes.CLEAR_USER_ARTICLES:
      return {
        ...state,
        cards: [],
      };
    case profilePageTypes.SET_USER_INFO: // смена пользователя
      return {
        ...state,
        user: action.payload,
        // Сброс загруженных карточек
        // TODO: сделать кеширование для кажлого юзера
        isLoading: false,
        idLastLoaded: '',
        cards: [],
        isEndFound: false,
      };
    case profilePageTypes.SET_USER_LOADING: // смена пользователя
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        idLastLoaded: '',
        cards: [],
        isEndFound: false,
      };
  }
  return state;
}
