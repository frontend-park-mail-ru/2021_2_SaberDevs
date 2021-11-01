import {categoryPageTypes} from '../types.js';

/**
 * Объект состояния на главной странице
 * @typedef {Object} CategoryPageState
 * @property {string} trackedCardId - ID карточки, которая при попадании
 *                                    в область видимости пользователя
 *                                    вызовет подгрузку новостей
 * @property {string} idLastLoaded  - ID последней загруженной карточки
 * @property {boolean} isLoading    - Идет ли загрузка сейчас. true запрещает
 *                                    отправку запросов на обновлении ленты,
 *                                    чтобы не спамить сервер
 * @property {number} lastScrollPos - Позиция скролла при покидании mainPage
 * @property {boolean} doNotUpload  - Запрещает загрузку при обнаружении конца
 *                                    ленты, чтобы не спамить сервер.
 *                                    Сбразывется через resetDoNotUploadTime мс
 * @property {Array.NewsCard} cards - Массив загруженных карточек для
 *                                    восстановления состояния при возвращении
 *                                    на MainPage
 */
const InitialCategoryPageState = {
  choosenTag: '',                // категория, по которой фильтруются записи
  trackedCardId: 'feed-loading', // отслеживаемая запись в ленте для подгрузки
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  lastScrollPos: 0,              // скрол для возврата к той же записи
  cards: [],                     // массив загруженных новостей
  doNotUpload: false,
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
    case categoryPageTypes.SET_CATEGORY_ARTICLES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case categoryPageTypes.FORBID_CATEGORY_ARTICLES_UPLOADING:
      return {
        ...state,
        doNotUpload: true,
      };
    case categoryPageTypes.ALLOW_CATEGORY_ARTICLES_UPLOADING:
      return {
        ...state,
        doNotUpload: false,
      };
    case categoryPageTypes.SAVE_NEW_CATEGORY_ARTICLES:
      return {
        ...state,
        isLoading: false,
        idLastLoaded: action.payload.idLastLoaded,
        cards: state.cards.concat(action.payload.cards),
      };
    case categoryPageTypes.SELECT_CATEGORY_ARTICLES_TAG:
      return {
        ...state,
        choosenTag: action.payload,
      };
    case categoryPageTypes.CLEAR_CATEGORY_ARTICLES_TAG:
      return {
        ...state,
        choosenTag: '',
      };
  }
  return state;
}
