import {mainPageTypes} from '../types.js';

const endOfFeedMarkerID = 'end';

/**
 * Объект состояния на главной странице
 * @typedef {Object} MainCardState
 * @property {string} idLastLoaded  - ID последней загруженной карточки
 * @property {string} login         - пользователь, для которого запрашивается
 *                                    подборка новостей
 * @property {boolean} isLoading    - Идет ли загрузка сейчас. true запрещает
 *                                    отправку запросов на обновлении ленты,
 *                                    чтобы не спамить сервер
 * @property {number} lastScrollPos - Позиция скролла при покидании mainPage
 * @property {boolean} isEndFound   - Запрещает загрузку при обнаружении конца
 *                                    ленты, чтобы не спамить сервер.
 *                                    Сбразывется через resetDoNotUploadTime мс
 * @property {Array.Card} cards     - Массив загруженных карточек для
 *                                    восстановления состояния при возвращении
 *                                    на MainPage
 */
const InitialMainPageState = {
  isAuthenticated: false,
  isLoading: false,              // отправлен ли запрос на сервер
  // TODO: убрать костыль
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  idLastLoaded: 0,              // запоминаем последнюю загруженную запись
  lastScrollPos: 0,              // скрол для возврата к той же записи
  cards: [],                     // массив загруженных новостей
  isEndFound: false,
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function mainPageReducer(state = InitialMainPageState, action) {
  switch (action.type) {
    case mainPageTypes.SET_LOADING_FLAG:
      return {
        ...state,
        isLoading: true,
      };
    case mainPageTypes.FORBID_CARDS_UPLOADING:
      return {
        ...state,
        isEndFound: true,
      };
    case mainPageTypes.ALLOW_CARDS_UPLOADING:
      return {
        ...state,
        isEndFound: false,
      };
    case mainPageTypes.SAVE_NEW_CARDS:
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
        // TODO: убрать костыль
        // idLastLoaded: cards[cards.length - 1]?.id || state.idLastLoaded,
        idLastLoaded: state.idLastLoaded + (cards.length || 0),
        cards: state.cards.concat(cards),
        isEndFound,
      };
    case mainPageTypes.CLEAR_CARDS:
      return {
        ...state,
        cards: [],
        isLoading: false,
        // TODO: убрать костыль
        // idLastLoaded: '',
        idLastLoaded: '',
        lastScrollPos: 0,
        isEndFound: false,
      };
  }
  return state;
}
