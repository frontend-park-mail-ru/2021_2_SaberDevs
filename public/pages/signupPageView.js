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
    bkgDiv.className = 'background-space';
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-space';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content-space';
    const formDiv = document.createElement('div');
    const logoDiv = document.createElement('a');
    logoDiv.innerHTML = 'SaberNews';
    logoDiv.className = 'header__title';
    logoDiv.href = '/';
    logoDiv.style.cssText = 'position: absolute;';

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
    pageDiv.appendChild(logoDiv);
    pageDiv.appendChild(contentDiv);
    bkgDiv.appendChild(pageDiv);
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
