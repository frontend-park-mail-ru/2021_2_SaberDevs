import modalComponent from './modal.js';

import Utils, {createInput} from '../utils.js';
import Ajax from '../modules/ajax.js';

import store from '../flux/store.js';
import {authorizationActions} from '../flux/actions.js';

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
 * @param {boolean} showRegister - true, если нужно отобразить
 * форму для регистрации, false - для входа
 * @return {HTMLFormElement}
 */
export default function signupForm(showRegister) {
  const createInputRow = Utils.createInputRow;

  const form = document.createElement('form');

  // поля формы
  let emailInput = null;
  let passwordRepeatInput = null;
  const loginInput = createInput('login', 'Логин', 'login',
      '4-20 символов, первый символ - буква', true);
  const passwordInput = createInput('password', 'Пароль', 'password',
      'Больше 8 символов. '+
      'Используйте строчные и заглавные буквы, цифры',
      true,
  );

  if (showRegister) {
    emailInput = createInput('email', 'e-mail', 'email', null, true);
    passwordRepeatInput = createInput(
        'password',
        'Повторите пароль',
        'passwordRepeat',
        null,
        true,
    );
  }

  // html5-свойства полей
  // https://habr.com/ru/post/545150/  - про регулярки
  loginInput.autofocus = true;
  loginInput.pattern = '^[a-zA-Z][a-zA-Z0-9_]{4,20}$';

  passwordInput.pattern =
    '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,256}$';

  if (showRegister) {
    emailInput.maxLength = 100;
    passwordRepeatInput.maxLength = 8;
    passwordRepeatInput.maxLength = 256;
  }

  form.appendChild(createInputRow(loginInput));
  if (showRegister) {
    form.appendChild(createInputRow(emailInput));
  }
  form.appendChild(createInputRow(passwordInput));
  if (showRegister) {
    form.appendChild(createInputRow(passwordRepeatInput));
  }

  // интерфейс формы
  const submitBtn = createInputRow(
      createInput(
          'submit',
          showRegister ? 'Зарегистрироваться' : 'Войти',
          'submitBtn',
          null,
          false,
      ),
  );
  submitBtn.classList.add('submit-btn-row');
  submitBtn.querySelector('#submitBtn').className = 'form-submit-btn';
  form.appendChild(submitBtn);

  // submit action
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const login = loginInput.value;
    const password = passwordInput.value;
    const email = emailInput?.value;
    const passwordRepeated = passwordRepeatInput?.value;

    // если пароли не совпадают
    if (showRegister && passwordRepeated !== password) {
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
      url: showRegister ? '/signup' : '/login',
      // TODO: encryption
      body: {
        login,
        email,
        password,
        // TODO:
        // showRegister ? name,
        // showRegister ? surname,
      },
    })
        .then(
            ({status, response}) => {
              if (status === Ajax.STATUS.ok) {
                store.dispatch(authorizationActions.login(response.data));
                modalComponent.close();
                return;
              }

              const formWarning = document.getElementById('auth-form-waring') ||
                document.createElement('div');
              formWarning.className = 'auth-form-waring';
              formWarning.id = 'auth-form-waring';
              formWarning.textContent = response.msg;
              form.appendChild(formWarning);
            });
  });

  return form;
}
