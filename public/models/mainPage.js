// ///////////////////////////////// //
//
//         App Configuration
//
// ///////////////////////////////// //

export const headerLinksOnLogin = [
  {name: 'Профиль', section: 'profilePage', href: '/profile'},
  {section: 'logout', name: 'Выход'},
];

export const headerLinksOnLogout = [
  {name: 'Зарегистрироваться', section: 'signupModal'},
  {name: 'Войти', section: 'loginModal'},
];

export const sideBarLinks = ['hello'];

export const InitialMainPageState = {
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
