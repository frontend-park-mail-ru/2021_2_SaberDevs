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

    // //////////////////////////////////

    const logoDiv = document.createElement('a');
    logoDiv.innerHTML = 'SaberNews';
    logoDiv.className = 'header__title card__lift-effect';
    logoDiv.href = '/';

    // //////////////////////////////////

    contentDiv.appendChild(logoDiv);
    pageDiv.appendChild(contentDiv);
    bkgDiv.appendChild(pageDiv);
    this.root.appendChild(bkgDiv);
  }

  /**
   * @param {boolean} showRegister
   */
  appendForm(showRegister) {
    const logoDiv = this.root.querySelector('.header__title');

    // Элементы навигации
    const changeFormTypeBtn = document.createElement('a');
    changeFormTypeBtn.textContent =
        showRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт';
    changeFormTypeBtn.href = showRegister ? '/login' : '/register';
    // changeFormTypeBtn.dataset.router = 'ignore';
    changeFormTypeBtn.className = 'form__link';

    changeFormTypeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // this.view.switchFormType(!this.showRegister);
    });

    // форма
    const form = (new SignupForm(showRegister).render());
    form.className = 'modal__form';
    const contentDiv = this.root.querySelector('.content-space');
    contentDiv.innerHTML = '';

    contentDiv.appendChild(logoDiv);
    contentDiv.appendChild(form);
    contentDiv.querySelector('#form-warning-label').parentElement
        .insertAdjacentElement('beforeBegin', changeFormTypeBtn);
  }
}
