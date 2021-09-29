import {createInput, createLabel} from '../utils.js';
import Ajax from '../modules/ajax.js';
import modalComponent from './modal.js';

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
//    Authorization Form
//
// ///////////////////////////////// //

/**
 * Содает форму регистрации
 * @param {Object} props
 * @property {boolean} isRegistered - true, если нужно отобразить форму
 * для входа, false - для регистрации
 * @property {loginCallback} onLogin действие, которое будет выполнено после
 * успешного входа/регистрации
 * @return {HTMLFormElement}
 */
export default function signupForm({onLogin, isRegistered}) {
  const form = document.createElement('form');

  // поля формы
  let emailInput = null;
  let passwordRepeatInput = null;
  const loginInput = createInput('login', 'Логин', 'login', true);
  // const loginLabel = createLabel(
  //     'login',
  //     '4-20 символов, первый символ - буква',
  // );
  const passwordInput = createInput('password', 'Пароль', 'password', true);
  // const passwordLabel = createLabel(
  //     'password',
  //     '8-256 символов, минимум 4 заглавных и строчных' +
  //     'латинских буквы, цифры, первый символ - буква',
  // );
  if (!isRegistered) {
    emailInput = createInput('email', 'e-mail', 'email', true);
    passwordRepeatInput = createInput(
        'password',
        'Повторите пароль',
        'passwordRepeat',
        true,
    );
  }

  // html5-свойства полей
  // https://habr.com/ru/post/545150/  - про регулярки
  loginInput.autofocus = true;
  loginInput.minlength = 5;
  loginInput.maxLength = 20;
  loginInput.pattern = '^[a-zA-Z][a-zA-Z0-9_]{4,20}$';

  passwordInput.minLength = 8;
  passwordInput.maxLength = 256;
  passwordInput.pattern =
    '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,256}$';

  if (!isRegistered) {
    emailInput.maxLength = 100;
    passwordRepeatInput.maxLength = 8;
    passwordRepeatInput.maxLength = 256;
  }

  // form.appendChild(loginLabel);
  form.appendChild(loginInput);
  if (!isRegistered) form.appendChild(emailInput);
  // form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  if (!isRegistered) form.appendChild(passwordRepeatInput);

  // интерфейс формы
  const submitBtn = document.createElement('input');
  submitBtn.type = 'submit';
  submitBtn.value = isRegistered ? 'Войти' : 'Зарегистрироваться';
  submitBtn.setAttribute('class', 'modal-btn-submit');
  form.appendChild(submitBtn);

  // submit action
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const login = loginInput.value;
    const password = passwordInput.value;
    const email = emailInput?.value;
    const passwordRepeated = passwordRepeatInput?.value;

    // если пароли не совпадают
    if (!isRegistered && passwordRepeated !== password) {
      const warningLabel = document.createElement('label');
      warningLabel.textContent = 'Пароли должны совпасть. Старайтесь';
      warningLabel.htmlFor = 'passwordRepeat';
      passwordRepeatInput.insertAdjacentHTML(
          'afterend',
          warningLabel.outerHTML,
      );
      return;
    }

    Ajax.post({
      url: isRegistered ? '/login' : '/signup',
      // TODO: encryption
      body: {
        login,
        email,
        password,
        // TODO:
        // !isRegistered ? name,
        // !isRegistered ? surname,
      },
      callback: (status, msg) => {
        let response = {};
        try {
          response = JSON.parse(msg);

          if (status === Ajax.STATUS.ok) {
            onLogin(response.data);
            modalComponent.close();
            return;
          }

          const formWarning = document.getElementById('auth-form-waring') ||
            document.createElement('div');
          formWarning.className = 'auth-form-waring';
          formWarning.id = 'auth-form-waring';
          formWarning.textContent = response.msg;
          form.appendChild(formWarning);
        } catch (e) {
          console.warn('Error. Server response in not JSON');
        }
      },
    });
  });

  return form;
}
