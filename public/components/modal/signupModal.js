import Modal from './modal.js';
import SignupForm from '../signupForm/signupForm.js';

/**
 * Страница содержит главный компонент - форму регистрации
 * @param {boolean} showRegister
 * true, если нужно отобразить форму
 * для регистрации, false - для входа
 */
export default function signupModal(showRegister) {
  // Элементы навигации
  const changeFormTypeBtn = document.createElement('a');
  changeFormTypeBtn.textContent =
    showRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт';
  changeFormTypeBtn.href = showRegister ? '/login' : '/register';
  changeFormTypeBtn.classList.add('link');
  changeFormTypeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    Modal.close();
    setTimeout(() => {
      signupModal(!showRegister);
    }, Modal.animationTime);
  });

  // форма
  const signupForm = new SignupForm(showRegister);
  const form = signupForm.render();

  const contentDiv = document.createElement('div');
  contentDiv.appendChild(form);
  contentDiv.appendChild(changeFormTypeBtn);

  Modal.setDocTitle(`SaberProject | ${showRegister ? 'Sign Up' : 'Login'}`);
  Modal.setTitle(showRegister ? 'Регистрация' : 'Вход');
  Modal.setContent(contentDiv);
  Modal.disableCancelBtn();
  Modal.disableOkBtn();
  Modal.open();
}
