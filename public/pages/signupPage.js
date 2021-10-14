import BaseView from './baseView.js';

import signupForm from '../components/signupForm.js';
import createToMenuBtn from '../components/buttonToMenu.js';

import store from '../flux/store.js';
// TODO:
// import {changePageActions} from '../flux/actions.js';
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
function render() {
  const state = store.getState().signupForm;
  
  // стираем старые элементы, чтобы нарисовать новые
  const root = this.el;
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
  // changeFormTypeBtn.addEventListener('click', (e) => {
  //   e.preventDefault();

  //   store.dispatch(state.showRegister ?
  //     signupFormActions.toggleToSigninForm() :
  //     signupFormActions.toggleToSignupForm()
  //   )

  //   modalComponent.close();
  //   setTimeout(() => {
  //     signupModal();
  //   }, modalComponent.animationTime);
  // });

  const backBtn = createToMenuBtn();

  root.appendChild(header)
  root.appendChild(form);
  root.appendChild(changeFormTypeBtn);
  root.appendChild(backBtn);
}

export default class SignupPage extends BaseView {
  constructor (el) {
		super(el);
    this.render = render;
	}
};