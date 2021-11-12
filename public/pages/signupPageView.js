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
    this.title = null;
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
    const bkgPage = document.createElement('div');
    bkgPage.className = 'form__page_bg';
    const formDiv = document.createElement('div');

    // //////////////////////////////////

    const formTitle = document.createElement('div');
    formTitle.textContent = 'Вход';
    formTitle.classList.add('form__title');

    // Элементы навигации
    const changeFormTypeBtn = document.createElement('a');
    changeFormTypeBtn.textContent = 'Создать аккаунт';
    changeFormTypeBtn.dataset.router = 'ignore';

    // форма
    formDiv.classList.add('form__page');
    formDiv.appendChild(formTitle);
    formDiv.appendChild(new SignupForm(false).render());
    formDiv.appendChild(changeFormTypeBtn);

    // //////////////////////////////////

    this.title = formTitle;
    this.changeFormTypeBtn = changeFormTypeBtn;
    this.formDiv = formDiv;

    // //////////////////////////////////

    bkgPage.appendChild(formDiv);
    contentDiv.appendChild(bkgPage);
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

    this.title.textContent = showRegister ? 'Регистрация' : 'Вход';
    this.changeFormTypeBtn.textContent =
      showRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт';

    this.formDiv.innerHTML = '';
    this.formDiv.appendChild(this.title);
    this.formDiv.appendChild(new SignupForm(showRegister).render());
    this.formDiv.appendChild(this.changeFormTypeBtn);
    this.formDiv.classList.add('form__page');
  }
}
