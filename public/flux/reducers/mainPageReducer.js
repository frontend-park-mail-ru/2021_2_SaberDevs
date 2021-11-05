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
 * @property {boolean} isEndFound  - Запрещает загрузку при обнаружении конца
 *                                    ленты, чтобы не спамить сервер.
 *                                    Сбразывется через resetDoNotUploadTime мс
 * @property {Array.NewsCard} cards - Массив загруженных карточек для
 *                                    восстановления состояния при возвращении
 *                                    на MainPage
 */
const InitialMainPageState = {
  isAuthenticated: false,
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  lastScrollPos: 0,              // скрол для возврата к той же записи
  login: '',                     // для какого пользователя подборка
  cards: [],                     // массив загруженных новостей
  isEndFound: false,
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
        idLastLoaded: cards[cards.length - 1]?.id || state.idLastLoaded,
        cards: state.cards.concat(cards),
        isEndFound,
      };
    case mainPageTypes.CLEAR_CARDS:
      return {
        ...state,
        cards: [],
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
