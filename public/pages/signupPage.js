import authForm from '../components/authorizationForm.js';
import createToMenuBtn from '../components/buttonToMenu.js';

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
export default function signupPage(props) {
  if (propsDebug) console.log('signupPage props: ', JSON.stringify(props));

  document.title = 'SaberProject | ' + (!props.isRegistered? 'Sign Up':'Login');
  // стираем старые элементы, чтобы нарисовать новые
  root.innerHTML = '';

  // форма
  const form = authForm(props);

  // Элементы навигации
  const backBtn = createToMenuBtn();

  const changeFormTypeBtn = document.createElement('a');
  changeFormTypeBtn.textContent =
    props.isRegistered ? 'Создать аккаунт' : 'У меня уже есть аккаунт';
  changeFormTypeBtn.href = !props.isRegistered ? '/login' : '/register';
  changeFormTypeBtn.dataset.section = 'changeRegFormType';

  root.appendChild(form);
  root.appendChild(changeFormTypeBtn);
  root.appendChild(backBtn);
}
