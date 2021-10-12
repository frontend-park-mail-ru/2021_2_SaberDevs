'use strict';

// pages & components
import signupPage from './pages/signupPage.js';
import signupModal from './components/signupModal.js';
import profilePage from './pages/profilePage.js';
import mainPage from './pages/mainPage.js';
import logoutRequest from './modules/logout.js';

import Ajax from './modules/ajax.js';

import store from './flux/store.js';
import {authorizationActions, signupFormActions} from './flux/actions.js';

const root = document.getElementById('root');

const configuration = {
  mainPage: {
    href: '/',
    name: 'Главная',
    open: {
      action: (props) => {
        mainPage(props);
      },
      props: null,
    },
  },
  signupPopUp: {
    href: '/signup',
    name: 'Регистрация',
    open: {
      action: (props) => {
        store.dispatch(signupFormActions.toggleToSignupForm())
        signupModal(props);
      },
      props: {
        onLogin: (props) => {
          store.dispatch(authorizationActions.login(props))
        },
      },
    },
  },
  loginPopUp: {
    href: '/login',
    name: 'Авторизация',
    open: {
      action: (props) => {
        store.dispatch(signupFormActions.toggleToSigninForm())
        signupModal(props);
      },
      props: {
        onLogin: (props) => {
          store.dispatch(authorizationActions.login(props));
        },
      },
    },
  },
  profilePage: {
    href: '/profile',
    name: 'Профиль',
    open: {
      action: () => {
        if (store.getState().mainPage.isAuthenticated) {
          profilePage();
        } else {
          // TODO: popup
          // state.isRegistered = true;
          // signupPage({
          //   onLogin: (props) => {
          //     state.isAuthenticated = true;
          //     state.headerLinks = headerLinksOnLogin;
          //     state.userData = props;
          //     store.dispatch(authorizationActions.login(props))
          //     store.dispatch(changePageActions.changePage('profile'))
          //     profilePage(props);
          //   },
          //   isRegistered: true,
          // });
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
        if (store.getState().mainPage.isAuthenticated) {
          logoutRequest((status) => {
            if (status === Ajax.STATUS.ok) {
              store.dispatch(authorizationActions.logout());
              console.log('logout successful');
            }
          });
        }
      },
      props: null,
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
function launchLogin() {
  Ajax.post({
    url: '/login',
    body: {},
    callback: (status, msg) => {
      if (status === Ajax.STATUS.ok) {
        store.dispatch(authorizationActions.login(JSON.parse(msg).data))
      } else {
        console.log('launchLogin failed');
      }
    },
  });
}

// ///////////////////////////////// //
//
//            Сама страница
//
// ///////////////////////////////// //

// TODO: экран загрузки
launchLogin()
mainPage();

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
    if (typeof action === 'function') {
      action.call(null, props);
    }
  }
});
