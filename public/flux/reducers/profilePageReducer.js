import {profilePageTypes} from '../types.js';

/**
 * Объект состояния на главной странице
 * @typedef {Object} MainCardState
 * @property {string} trackedCardId - ID карточки, которая при попадании
 *                                    в область видимости пользователя
 *                                    вызовет подгрузку новостей
 * @property {string} idLastLoaded  - ID последней загруженной карточки
 *                                    подборка новостей
 * @property {boolean} isLoading    - Идет ли загрузка сейчас. true запрещает
 *                                    отправку запросов на обновлении ленты,
 *                                    чтобы не спамить сервер
 * @property {boolean} doNotUpload  - Запрещает загрузку при обнаружении конца
 *                                    ленты, чтобы не спамить сервер.
 *                                    Сбразывется через resetDoNotUploadTime мс
 * @property {Array.NewsCard} cards - Массив загруженных карточек для
 *                                    восстановления состояния при возвращении
 *                                    на MainPage
 */
const InitialProfilePageState = {
  user: {},
  trackedCardId: 'feed-loading', // отслеживаемая запись в ленте для подгрузки
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  articles: [],                     // массив загруженных новостей
  doNotUpload: false,
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
        doNotUpload: true,
      };
    case profilePageTypes.ALLOW_USER_ARTICLES_UPLOADING:
      return {
        ...state,
        doNotUpload: false,
      };
    case profilePageTypes.SAVE_NEW_USER_ARTICLES:
      return {
        ...state,
        isLoading: false,
        idLastLoaded: action.payload.idLastLoaded,
        articles: state.articles.concat(action.payload.articles),
      };
  }
  return state;
}
