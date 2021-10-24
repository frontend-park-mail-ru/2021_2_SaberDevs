import {mainPageTypes} from '../types.js';

const headerLinksOnLogin = [
  {name: 'Профиль', section: 'profilePage', href: '/profile'},
  {section: 'logout', name: 'Выход'},
];

const headerLinksOnLogout = [
  {name: 'Зарегистрироваться', section: 'signupModal'},
  {name: 'Войти', section: 'loginModal'},
];

const sideBarLinks = ['hello'];


/**
 * Объект состояния на главной странице
 * @typedef {Object} MainCardState
 * @property {string} trackedCardId - ID карточки, которая при попадании
 *                                    в область видимости пользователя
 *                                    вызовет подгрузку новостей
 * @property {string} idLastLoaded  - ID последней загруженной карточки
 * @property {string} login         - пользователь, для которого запрашивается
 *                                    подборка новостей
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
const InitialMainPageState = {
  isAuthenticated: false,
  trackedCardId: 'loading-card', // отслеживаемая запись в ленте для подгрузки
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  lastScrollPos: 0,              // скрол для возврата к той же записи
  login: '',                     // для какого пользователя подборка
  cards: [],                     // массив загруженных новостей
  doNotUpload: false,
  headerLinks: headerLinksOnLogout,
  sideBarLinks,
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
        doNotUpload: true,
      };
    case mainPageTypes.ALLOW_CARDS_UPLOADING:
      return {
        ...state,
        doNotUpload: false,
      };
    case mainPageTypes.SAVE_NEW_CARDS:
      return {
        ...state,
        isLoading: false,
        idLastLoaded: action.payload.idLastLoaded,
        cards: state.cards.concat(action.payload.cards),
      };
    case mainPageTypes.TOGGLE_AUTH:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        login: action.payload.login,
        headerLinks: action.payload.isAuthenticated ?
          headerLinksOnLogin : headerLinksOnLogout,
      };
  }
  return state;
}
