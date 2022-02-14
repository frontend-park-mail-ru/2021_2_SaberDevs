import BaseComponent from '../_basic/baseComponent';
import SignupFormView from './signupFormView';

import Modal from '../modal/modal.js';

import Ajax from '../../modules/ajax';

import store from '../../flux/store';
import authorizationActions from '../../flux/actions/authorizationActions';

import {SubmitFunction} from './signupFormView';

/**
 * Возвращает метод отправки звпроса на вход или регистрацию
 * В случае неудачи, вызывается renderError
 * @param {Function<string>} renderError
 * @return {SubmitFunction}
 */
function wrapSubmitHandler(renderError: (msg: string) => void): SubmitFunction {
  return function(showRegister, login, password, email) {
    Ajax.post({
      url: showRegister ? '/user/signup' : '/user/login',
      body: {
        login,
        email: email || '',
        password,
      },
    })
        .then(
          ({status, response}) => {
            if (status === Ajax.STATUS.ok) {
              store.dispatch(authorizationActions.login(response.data));
              Modal.close();
              return;
            }

            renderError(response.msg);
          });
  };
}

/**
 * ViewModel-компонент соответсвующего View
 * @class SignupForm
 */
export default class SignupForm extends BaseComponent {
  view: SignupFormView;
  showRegister: boolean;
  /**
   * Универсальный компонент заголовка
   * @param {boolean} showRegister форма регистрации / форма входа
   */
  constructor(showRegister: boolean) {
    super();
    this.view = new SignupFormView();
    this.showRegister = showRegister;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();
    this.root = this.view.render(
        this.showRegister,
        wrapSubmitHandler(this.view.appendWarning),
    );
    return this.root;
  }
}
