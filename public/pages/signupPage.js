import BasePageMV from './basePageMV.js';
import SignupPageView from './signupPageView.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';
import {authorizationTypes} from '../flux/types.js';

import {redirect} from '../utils.js';
// ///////////////////////////////// //
//
//         Signup Page
//
// ///////////////////////////////// //

/**
 * @class SignupPage
 */
export default class SignupPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new SignupPageView(root);
    this.showRegister = false;  // отображение формы логины
    this.unsubscribeLogin = () => {};
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();
    this.showRegister = false;
    this.unsubscribeLogin = store.subscribe(
        authorizationTypes.LOGIN,
        () => {
          redirect('/');
        },
    );

    this.view.changeFormTypeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.showRegister = !this.showRegister;
      this.view.switchFormType(this.showRegister);
    });
    store.dispatch(
        changePageActions.changePage(
            'signup',
            `SaberProjects | ${this.showRegister? 'Signup' : 'Login'}`,
        ),
    );
  }

  /**
   * Скрыть подконтрольную страницу
   */
  hide() {
    super.hide();
    this.unsubscribeLogin();
  }
}
