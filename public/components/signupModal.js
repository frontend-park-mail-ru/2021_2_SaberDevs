import Modal from './modal/modal.js';
import SignupForm from './signupForm/signupForm.js';
import {modalTypes} from '../flux/types.js';
import store from '../flux/store.js';

// ///////////////////////////////// //
//
//          Globals
//
// ///////////////////////////////// //

/**
 * Выполняется, если вход успешный
 * @callback loginCallback
 * @param {Object} props
 */

store.subscribe(modalTypes.MODAL_CLOSE, () => {
  document.title = store.getState().page.docTitle;
});

store.subscribe(modalTypes.MODAL_OPEN, () => {
  document.title = `SaberProject |
  ${store.getState().signupForm.showRegister ? 'Sign Up':'Login'}`;
});

// ///////////////////////////////// //
//
//         Page Content
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - форму регистрации
 * @param {boolean} showRegister
 * true, если нужно отобразить форму
 * для входа, false - для регистрации
 */
export default function signupModal(showRegister) {
  // Элементы навигации
  const changeFormTypeBtn = document.createElement('a');
  changeFormTypeBtn.textContent =
    showRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт';
  changeFormTypeBtn.href = showRegister ? '/login' : '/register';
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
  console.warn('после рендера формы:');
  console.warn({form});
  console.warn(form);
  console.warn('тип form HTMLElement:', form instanceof HTMLElement);

  const contentDiv = document.createElement('div');
  contentDiv.appendChild(form);
  // contentDiv.appendChild(changeFormTypeBtn);
  console.warn(contentDiv);
  // TODO: footer
  // const okBtn = document.getElementById('modal-btn-ok');
  // okBtn.textContent = 'Закрыть';
  // const cancelBtn = document.getElementById('modal-btn-cancel');
  // cancelBtn.style.display = 'none';

  Modal.setTitle(showRegister ? 'Регистрация' : 'Вход');
  Modal.setContent(contentDiv.firstChild);
  Modal.open();
}
