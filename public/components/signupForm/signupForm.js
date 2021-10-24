import BaseComponent from '../_basic/baseComponent.js';
import SignupFormView from './signupFormView.js';

import modalComponent from '../modal.js';

import Ajax from '../../modules/ajax.js';

import store from '../../flux/store.js';
import {authorizationActions} from '../../flux/actions.js';

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
      // TODO: encryption
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
                modalComponent.close();
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
   * @param {bolean} showRegister форма регистрации / форма входа
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

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    super.destroy();
  }
}
