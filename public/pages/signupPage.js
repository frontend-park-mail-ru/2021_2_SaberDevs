import BasePageMV from './basePageMV.js';
import SignupPageView from './signupPageView.js';
import SignupForm from '../components/signupForm/signupForm.js';
import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';
import {authorizationTypes} from '../flux/types.js';

import {redirect} from '../common/utils.js';
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

    if (document.URL.includes('register')) {
      this.showRegister = true;
      // switchFormType(this.showRegister);
    }
    else {
      this.showRegister = false;
    }

    this.view.appendForm(this.showRegister);

    this.showRegister = false;
    this.unsubscribeLogin = store.subscribe(
        authorizationTypes.LOGIN,
        () => {
          redirect('/');
        },
    );

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

  /**
   * @param {string} path
   * @return {string}
   */
  redirect(path) {
    const link = this.view.root.querySelector('a.form__link');
    const a = link?.pathname;
    if (a && a !== path) {
      this.showRegister = path === '/login';
      console.warn(path, this.showRegister)
      this.view.appendForm(this.showRegister);
    }
    return '';
  }
}
