// components (no pages there)
import signupModal from './signupModal.js';

// network
import {logoutRequest} from '../modules/ajax_requests.js';

// flux store
import store from '../flux/store.js';
import {signupFormActions} from '../flux/actions.js';

// ///////////////////////////////// //
//
//     Определяет взаимодействие
//     со ссылками, но не с
//     переходами по страницам
//
// ///////////////////////////////// //
const configuration = {
  signupPopUp: {
    action: () => {
      store.dispatch(signupFormActions.toggleToSignupForm())
      signupModal();
    },
    props: null,
  },

  loginPopUp: {
    action: () => {
      store.dispatch(signupFormActions.toggleToSigninForm())
      signupModal();
    },
    props: null,
  },

  logout: {
    action: () => {
      if (store.getState().mainPage.isAuthenticated) {
        logoutRequest();
      }
    },
    props: null,
  },

  template: {
    action: () => {

    },
    props: null,
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

    const props = configuration[target.dataset.section]?.props;
    const action = configuration[target.dataset.section]?.action;
    if (typeof action === 'function') {
      action.call(null, props);
    }
  }
}

export default class LinksController {
  constructor(root) {
    this.root = root;
    this.enabled = false;
  }

  //TODO: register

  enable() {
    if (!this.enabled) {
      this.enabled = true;
      this.root.addEventListener('click', linksControllerClickHandler);
    }
  }

  disable() {
    if (this.enabled) {
      this.enabled = false;
      this.root.removeEventListener('click', linksControllerClickHandler);
    }
  }
}