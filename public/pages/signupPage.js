import BaseView from './baseView.js';

import signupForm from '../components/signupForm.js';
import createToMenuBtn from '../components/buttonToMenu.js';

import store from '../flux/store.js';
// TODO: later
// import {changePageActions} from '../flux/actions.js';
// import {signupFormActions} from '../flux/actions.js';

/**
 * @class SignupPage
 */
export default class SignupPage extends BaseView {
  /**
   * @param {*} rootElement
   */
  constructor(rootElement) {
    super(rootElement);
    this.render = render;
  }

  /**
   * Страница содержит главный компонент - форму регистрации
   */
  render() {
    const state = store.getState().signupForm;

    // стираем старые элементы, чтобы нарисовать новые
    const root = this.rootElement;
    root.innerHTML = '';

    // форма
    const form = signupForm(state.showRegister);

    const header = document.createElement('h2');
    header.innerHTML = state.showRegister ? 'Регистрация' : 'Вход';

    // Элементы навигации
    const changeFormTypeBtn = document.createElement('a');
    changeFormTypeBtn.textContent =
      state.showRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт';
    changeFormTypeBtn.href = state.showRegister ? '/login' : '/register';

    const backBtn = createToMenuBtn();

    root.appendChild(header);
    root.appendChild(form);
    root.appendChild(changeFormTypeBtn);
    root.appendChild(backBtn);
  }
};
