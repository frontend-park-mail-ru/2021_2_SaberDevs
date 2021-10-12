import modalComponent from './modal.js';
import signupForm from './signupForm.js';
import store from '../flux/store.js';
import {signupFormActions} from '../flux/actions.js';


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
export default function signupModal(props) {
  const state = store.getState().signupForm;
  if (propsDebug) {
    console.log('signupPage props: ', JSON.stringify(props));
  }
  //TODO: ?
  const documentTitleInitial = props.docTitle || document.title;
  document.title = 'SaberProject | ' + (state.showRegister ? 'Sign Up':'Login');

  // форма
  props.isRegistered = !state.showRegister;
  const form = signupForm(props);
  
  // Элементы навигации
  const changeFormTypeBtn = document.createElement('a');
  changeFormTypeBtn.textContent =
    state.showRegister ? 'У меня уже есть аккаунт' : 'Создать аккаунт';
  changeFormTypeBtn.href = state.showRegister ? '/login' : '/register';
  changeFormTypeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    store.dispatch(state.showRegister ?
      signupFormActions.toggleToSigninForm() :
      signupFormActions.toggleToSignupForm()
    )
    props.docTitle = documentTitleInitial;
    modalComponent.close();
    setTimeout(() => {
      signupModal(props);
    }, modalComponent.animationTime);
  });

  modalComponent.setTitle(state.showRegister ? 'Регистрация' : 'Вход');
  const okBtn = document.getElementById('modal-btn-ok');
  okBtn.textContent = 'Закрыть';
  okBtn.onclick = () => {
    document.title = documentTitleInitial;
  };
  const cancelBtn = document.getElementById('modal-btn-cancel');
  cancelBtn.style.display = 'none';
  const contentDiv = document.getElementById('modal-content');
  contentDiv.innerHTML = '';
  contentDiv.appendChild(form);
  contentDiv.appendChild(changeFormTypeBtn);
  modalComponent.open();
}
