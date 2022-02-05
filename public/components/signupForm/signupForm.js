import BaseComponent from '../_basic/baseComponent.js';
import SignupFormView from './signupFormView.js';

import Modal from '../modal/modal.js';

import Ajax from '../../modules/ajax';

import store from '../../flux/store';
import authorizationActions from '../../flux/actions/authorizationActions';

/**
 * Возвращает метод отправки звпроса на вход или регистрацию
 * В случае неудачи, вызывается renderError
 * @param {Function} renderError
 * @return {Function}
 */
function wrapSubmitHandler(renderError) {
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
  /**
   * Универсальный компонент заголовка
   * @param {boolean} showRegister форма регистрации / форма входа
   */
  constructor(showRegister) {
    super();
    this.view = new SignupFormView();
    this.showRegister = showRegister;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render(
        this.showRegister,
        wrapSubmitHandler(this.view.appendWarning),
    );
    return this.root;
  }
}
