'use strict';

// pages & components
import signupPage from './pages/signupPage.js';
import profilePage from './pages/profilePage.js';
import {uploadNextCards} from './pages/mainPage.js';
import mainPage from './pages/mainPage.js';

import Utils from './utils.js';
import Ajax from './modules/ajax.js';

const root = document.getElementById('root');

const headerLinks = ['signupPopUp', 'loginPopUp', 'profilePage'];
const sideBarLinks = ['hello'];

const state = {
  currentPage: 'main',     //
  isAuthenticated: false,  // верстка зависит от того, залогинен ли пользователь
  isRegistered: true,      // верстка формы авторизации: вход или регистрация
  userData: {},            // данные пользователя с бека, если авторизован
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
        mainPage(props);
      },
      props: {
        // монтируются сюда позже
        // headerLinks: createNavLinksArray(headerLinks),
        // sideBarLinks: createNavLinksArray(sideBarLinks),
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
        signupPage(props);
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          state.userData = props;
          // TODO: remove it V
          state.currentPage = 'profilePage';
          profilePage(props);
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
        signupPage(props);
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          state.userData = props;
          // TODO: remove it V
          state.currentPage = 'profilePage';
          profilePage(props);
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
      } else {
        console.log('launchLogin failed');
      }
      onDone();
    },
  });
}

/**
 * Переводит массив строк в массив элементо-тегов-а,
 * со свойствами согласно configurations
 * @param {Array.string} linksConfigNameArray
 * @return {Array.HTMLAnchorElement}
 */
function createNavLinksArray(linksConfigNameArray) {
  const res = [];

  linksConfigNameArray.map( (linkElement) => {
    if (!(linkElement in configuration)) {
      console.log('Error:' + linkElement + 'is not described in configuration');
      return;
    }

    const {href, name} = configuration[linkElement];

    const headerNavLink = document.createElement('a');
    headerNavLink.href = href;
    headerNavLink.textContent = name;

    headerNavLink.dataset.section = linkElement;

    res.push(headerNavLink);
  });

  return res;
}

// небольшой костыль, чтобы исправить перекрестную ссылку:
// configuration ссылается на createNavLinkArray, а
// createNavLinkArray использует configuration
// TODO: найти более элегантное решение
configuration.mainPage.open.props.headerLinks =
  createNavLinksArray(headerLinks);
configuration.mainPage.open.props.sideBarLinks =
  createNavLinksArray(sideBarLinks);

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
