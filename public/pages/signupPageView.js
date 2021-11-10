import BasePageView from './basePageView.js';

import SignupForm from '../components/signupForm/signupForm.js';

// ///////////////////////////////// //
//
//       Signup Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - форму изменения профиля.
 * @class SignupPageView
 */
export default class SignupPageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.formDiv = null;
    this.changeFormTypeBtn = null;
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    const bkgDiv = document.createElement('div');
    bkgDiv.className = 'background';
    const screenDiv = document.createElement('div');
    screenDiv.className = 'screen';
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    const formDiv = document.createElement('div');

    // //////////////////////////////////

    // Элементы навигации
    const changeFormTypeBtn = document.createElement('a');
    changeFormTypeBtn.textContent = 'Создать аккаунт';
    changeFormTypeBtn.dataset.router = 'ignore';

    // форма
    formDiv.appendChild(new SignupForm(false).render());

    // //////////////////////////////////

    this.formDiv = formDiv;
    this.changeFormTypeBtn = changeFormTypeBtn;

    // //////////////////////////////////

    contentDiv.appendChild(formDiv);
    contentDiv.appendChild(changeFormTypeBtn);
    pageDiv.appendChild(contentDiv);
    screenDiv.appendChild(pageDiv);
    bkgDiv.appendChild(screenDiv);
    this.root.appendChild(bkgDiv);
  }

  /**
   * Сменить форму логин / регистрация
   * @param {bolean} showRegister true, чтобы отобразить форму регистрации
   * flase - логина
   */
  switchFormType(showRegister) {
    if (!this.formDiv || !this.changeFormTypeBtn) {
      console.warn('[SignupPage] was not rendered yet');
      return;
    }
    this.formDiv.innerHTML = '';
    this.formDiv.appendChild(new SignupForm(showRegister).render());
    this.changeFormTypeBtn.textContent =
      showRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт';
  }
}
