import modalComponent from './modal.js';
import signupForm from './signupForm.js';
import store from '../flux/store.js';
import {signupFormActions} from '../flux/actions.js';
import {modalTypes} from '../flux/types.js';


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
  document.title = `SaberProject | ${store.getState().signupForm.showRegister ? 'Sign Up':'Login'}`;
});

// ///////////////////////////////// //
//
//         Page Content
//
// ///////////////////////////////// //

/**
 * импортирует root-элемент через замыкание
 *
 * Страница содержит главный компонент - форму регистрации
 * для нее обязательны следующие поля
 * @param {Object} props
 * @property {boolean} isRegistered - true, если нужно отобразить форму
 * для входа, false - для регистрации
 * @property {loginCallback} onLogin действие, которое будет выполнено после
 * успешного входа/регистрации
 */
export default function signupModal(showRegister) {
  // форма
  const form = signupForm(showRegister);
  
  // Элементы навигации
  const changeFormTypeBtn = document.createElement('a');
  changeFormTypeBtn.textContent =
    showRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт';
  changeFormTypeBtn.href = showRegister ? '/login' : '/register';
  changeFormTypeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    modalComponent.close();
    setTimeout(() => {
      signupModal(!showRegister);
    }, modalComponent.animationTime);
  });

  modalComponent.setTitle(showRegister ? 'Регистрация' : 'Вход');
  const okBtn = document.getElementById('modal-btn-ok');
  okBtn.textContent = 'Закрыть';
  const cancelBtn = document.getElementById('modal-btn-cancel');
  cancelBtn.style.display = 'none';
  const contentDiv = document.getElementById('modal-content');
  contentDiv.innerHTML = '';
  contentDiv.appendChild(form);
  contentDiv.appendChild(changeFormTypeBtn);
  modalComponent.open();
}
