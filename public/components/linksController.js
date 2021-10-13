// pages & components
import signupModal from './signupModal.js';
import profilePage from '../pages/profilePage.js';
import mainPage from '../pages/mainPage.js';

// network
import {logoutRequest} from '../modules/ajax_requests.js';

// flux store
import store from '../flux/store.js';
import {signupFormActions} from '../flux/actions.js';


const root = document.getElementById('root');
let enabled = false;

// ///////////////////////////////// //
//
//     Определяет взаимодействие
//     со ссылками
//
// ///////////////////////////////// //
const configuration = {
  mainPage: {
    href: '/',
    name: 'Главная',
    open: {
      action: () => {
        mainPage();
      },
      props: null,
    },
  },
  signupPopUp: {
    href: '/signup',
    name: 'Регистрация',
    open: {
      action: () => {
        store.dispatch(signupFormActions.toggleToSignupForm())
        signupModal();
      },
      props: null,
    },
  },
  loginPopUp: {
    href: '/login',
    name: 'Авторизация',
    open: {
      action: () => {
        store.dispatch(signupFormActions.toggleToSigninForm())
        signupModal();
      },
      props: null,
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
          store.dispatch(signupFormActions.toggleToSigninForm())
          signupModal();
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
          logoutRequest();
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
//     Общий глобальный обработчик
//     действует только на ссылки
//
// ///////////////////////////////// //

function linksControllerClickHandler(e) {
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
}

const linksController = {
  enable: () => {
    if (!enabled) {
      enabled = true;
      root.addEventListener('click', linksControllerClickHandler);
    }
  },
  disable: () => {
    if (enabled) {
      enabled = false;
      root.removeEventListener('click', linksControllerClickHandler);
    }
  },
};

export default linksController;