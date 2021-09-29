'use strict';

// pages & components
import signupPage from './pages/signupPage.js';
import signupModal from './components/signupModal.js';
import profilePage from './pages/profilePage.js';
import {uploadNextCards, setHeaderLinks} from './pages/mainPage.js';
import mainPage from './pages/mainPage.js';
import logoutRequest from './modules/logout.js';

import Utils from './utils.js';
import Ajax from './modules/ajax.js';

const root = document.getElementById('root');

const headerLinksOnLogin = [
  {name: 'Профиль', section: 'profilePage', href: '/profile'},
  {href: '/logout', section: 'logout', name: 'Выход'},
];
const headerLinksOnLogout = [
  {name: 'Зарегистрироваться', section: 'signupPopUp', href: '/signup'},
  {name: 'Войти', section: 'loginPopUp', href: '/login'},
];
const sideBarLinks = ['hello'];

// глобальное состояние приложения
// все важнейшие данные, получаемые с API-сервера, флаги
const state = {
  currentPage: 'main',     // текщуая отображаемая страница
  isAuthenticated: false,  // верстка зависит от того, залогинен ли пользователь
  isRegistered: true,      // верстка формы авторизации: вход или регистрация
  userData: {},            // данные пользователя с бека, если авторизован
  headerLinks: headerLinksOnLogout,
  mainPageState: {
    trackedCardId: 'loading-card', // отслеживаемая запись в ленте для подгрузки
    isLoading: false,              // отправлен ли запрос на сервер
    idLastLoaded: '',              // запоминаем последнюю загруженную запись
    lastScrollPos: 0,              // скрол для возврата к той же записи
    login: '',                     // для какого пользователя подборка
    cards: [],                     // массив загруженных новостей
    doNotUpload: false,
  },
};

const configuration = {
  mainPage: {
    href: '/',
    name: 'Главная',
    open: {
      action: (props) => {
        state.currentPage = 'mainPage';
        props.headerLinks = state.headerLinks;
        mainPage(props);
      },
      props: {
        sideBarLinks,
        headerLinks: state.headerLinks,
        isAuthenticated: state.isAuthenticated,
        userData: state.userData,
        state: state.mainPageState,
        // создаем такой обработчик, который можно будет удалить
        // это обертка функции в (event) => undefined
        newsFeedEndReachEventAction(event) {
          const trackedCard = document.getElementById(
              state.mainPageState.trackedCardId,
          );
          // работаем, только если отслеживаемый элемент
          // находися в области видимости пользователя
          if (state.mainPageState.isLoading ||
            trackedCard.getBoundingClientRect().y>Utils.getUserWindowHeight()) {
            return;
          }
          console.log('scroll trigger');
          uploadNextCards(state.mainPageState);
        },
      },
    },
  },
  signupPopUp: {
    href: '/signup',
    name: 'Регистрация',
    open: {
      action: (props) => {
        state.isRegistered = false;
        signupModal(props);
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          state.userData = props;
          state.headerLinks = headerLinksOnLogin;
          setHeaderLinks(state.headerLinks);
        },
        isRegistered: false,
      },
    },
  },
  loginPopUp: {
    href: '/login',
    name: 'Авторизация',
    open: {
      action: (props) => {
        state.isRegistered = true;
        signupModal(props);
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          state.userData = props;
          state.headerLinks = headerLinksOnLogin;
          setHeaderLinks(state.headerLinks);
        },
        isRegistered: true,
      },
    },
  },
  profilePage: {
    href: '/profile',
    name: 'Профиль',
    open: {
      action: () => {
        if (state.isAuthenticated) {
          state.currentPage = 'profilePage';
          profilePage(state.userData);
        } else {
          // TODO: popup
          state.isRegistered = true;
          signupPage({
            onLogin: (props) => {
              state.isAuthenticated = true;
              state.headerLinks = headerLinksOnLogin;
              state.userData = props;
              profilePage(props);
            },
            isRegistered: true,
          });
        }
      },
      props: null,
    },
  },
  logout: {
    href: '/logout',
    name: 'Выход',
    open: {
      action: () => {
        if (state.isAuthenticated) {
          logoutRequest((status) => {
            if (status === Ajax.STATUS.ok) {
              state.isAuthenticated = false;
              state.headerLinks = headerLinksOnLogout;
              setHeaderLinks(state.headerLinks);
              console.log('logout successful');
            }
          });
        }
      },
      props: null,
    },
  },

  // others navigations (apart menu)

  // auth form
  changeRegFormType: {
    open: {
      action: (props) => {
        state.isRegistered = !state.isRegistered;
        props.isRegistered = state.isRegistered;
        signupPage(props);
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          state.userData = props;
          profilePage(props);
        },
      },
    },
  },

  template: {
    open: {
      action: () => {

      },
      props: null,
    },
  },
};

// ///////////////////////////////// //
//
//                utils
//
// ///////////////////////////////// //

/**
 * Попытка аутентификации пользователя
 * через куки при загрузке приложения
 * @param {callback} onDone - метод, выполняюшийся
 * после получения ответа
 */
function launchLogin(onDone) {
  Ajax.post({
    url: '/login',
    body: {},
    callback: (status, msg) => {
      if (status === Ajax.STATUS.ok) {
        state.isAuthenticated = true;
        state.userData = JSON.parse(msg).data;
        state.headerLinks = headerLinksOnLogin;
        setHeaderLinks(state.headerLinks);
      } else {
        console.log('launchLogin failed');
      }
      onDone();
    },
  });
}

// ///////////////////////////////// //
//
//            Сама страница
//
// ///////////////////////////////// //

// TODO: экран загрузки
launchLogin(() => mainPage(configuration.mainPage.open.props));

// ///////////////////////////////// //
//
//     Общий глобальный обработчик
//     действует только на ссылки
//
// ///////////////////////////////// //

root.addEventListener('click', (e) => {
  const {target} = e;

  // проверям, что клик был по ссылке (anchor)
  if (target instanceof HTMLAnchorElement) {
    e.preventDefault();

    if (routerDebug) {
      console.log('targeter: ', target.dataset.section);
    }

    const props = configuration[target.dataset.section]?.open?.props;
    const action = configuration[target.dataset.section]?.open?.action;
    if (action !== undefined) {
      if (target.dataset.section.indexOf('Page') !== -1) {
        // дополнительные действия при переходе на другие страницы
        switch (state.currentPage) {
          case 'mainPage':
            window.removeEventListener(
                'scroll',
                configuration.mainPage.open.props.newsFeedEndReachEventAction,
                false,
            );
            break;
          case 'profilePage':
            console.log('u r leaving profilePage');
            break;
        }
      }
      action.call(null, props);
    }
  }
});
