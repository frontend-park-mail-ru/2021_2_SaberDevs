import Modal from './modal.js';
import SignupForm from '../signupForm/signupForm';

/**
 * Страница содержит главный компонент - форму регистрации
 * @param {boolean} showRegister
 * true, если нужно отобразить форму
 * для регистрации, false - для входа
 */
export function signupModal(showRegister) {
  // Элементы навигации
  const changeFormTypeBtn = document.createElement('a');
  changeFormTypeBtn.textContent =
    showRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт';
  changeFormTypeBtn.href = showRegister ? '/login' : '/register';
  changeFormTypeBtn.classList.add('form__link');
  changeFormTypeBtn.addEventListener('click', (e/*: Event*/) => {
    e.preventDefault();

    Modal.close();
    setTimeout(() => {
      signupModal(!showRegister);
    }, Modal.animationTime);
  });

  // форма
  const signupForm = new SignupForm(showRegister);
  const form = signupForm.render();
  form.className = 'modal__form';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'modal__content-inner';
  contentDiv.appendChild(form);
  contentDiv.querySelector('#form-warning-label').parentElement
      .insertAdjacentElement('beforeBegin', changeFormTypeBtn);

  Modal.setDocTitle(`SaberProject | ${showRegister ? 'Sign Up' : 'Login'}`);
  Modal.setTitle(showRegister ? 'Регистрация' : 'Вход');
  Modal.setContent(contentDiv);
  Modal.disableCancelBtn();
  Modal.disableOkBtn();
  Modal.open();
}

/**
 * @class SignupModal
 */
export default class SignupModal {
  /**
   * @param {boolean} showRegister
   * true, если нужно отобразить форму
   * для регистрации, false - для входа
   * По умолчанию false
   */
  static show(showRegister = false) {
    signupModal(showRegister);
  }

  /**
   * показать ошибку принудительно
   * @param {string} msg
   */
  static appendWarning(msg) {
    const contentDiv = Modal.getContent();
    if (!contentDiv) {
      return;
    }
    contentDiv.innerHTML += msg;
  }
}
