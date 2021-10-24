import BaseComponentView from '../_basic/baseComponentView.js';
// import ... from './.pug.js';

import {createInput, createInputRow} from '../../utils.js';

/**
 * @class SignupViewView
 */
export default class SignupViewView extends BaseComponentView {
  /**
   * Изменяемый элемент
   */
  constructor() {
    super();
    this.root = document.createElement('div');
    /**
     * @param {string} msg
     */
    this.appendWarning = (msg) => {
      const formWarning = document.getElementById('auth-form-waring') ||
        document.createElement('div');
      formWarning.className = 'auth-form-waring';
      formWarning.id = 'auth-form-waring';
      formWarning.textContent = msg;
      this.root.appendChild(formWarning);
    };
  }
  /**
   * Содает форму регистрации
   * @param {boolean} showRegister - true, если нужно отобразить
   * форму для регистрации, false - для входа
   * @param {Function} submitHandler
   * @return {HTMLFormElement}
   */
  render(showRegister, submitHandler) {
    const form = document.createElement('form');

    // поля формы
    let emailInput = null;
    let passwordRepeatInput = null;
    const loginInput = createInput('text', 'Логин', 'login',
        '4-20 символов, первый символ - буква', true);
    const passwordInput = createInput('password', 'Пароль', 'password',
        'Больше 8 любых непробельных символов.',
        true,
    );
    const passwordInputWrapper = document.createElement('div');
    passwordInputWrapper.className = 'password';
    const passwordShowBtn = document.createElement('a');
    passwordShowBtn.className = 'password-control-btn';
    passwordShowBtn.addEventListener('click', ({target}) => {
      const input = passwordInputWrapper.querySelector('#input-password');
      if (input.getAttribute('type') === 'password') {
        target.classList.add('password-show');
        input.setAttribute('type', 'text');
      } else {
        target.classList.remove('password-show');
        input.setAttribute('type', 'password');
      }
    });
    passwordInputWrapper.appendChild(passwordInput);
    passwordInputWrapper.appendChild(passwordShowBtn);


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
    // loginInput.autofocus = true;
    loginInput.pattern = '^[a-zA-Z][a-zA-Z0-9_]{4,20}$';

    passwordInput.pattern =
      '^\\S{8,40}$';
    // '^[A-Za-z0-9.,\\/#!$%\\^&\\*;:{}=\\-_`~()]{8,40}$';
    // '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,256}$';

    if (showRegister) {
      emailInput.maxLength = 100;
      passwordRepeatInput.maxLength = 8;
      passwordRepeatInput.maxLength = 40;
    }

    form.appendChild(createInputRow(loginInput));
    if (showRegister) {
      form.appendChild(createInputRow(emailInput));
    }
    form.appendChild(createInputRow(passwordInputWrapper));
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
    submitBtn.querySelector('#input-submitBtn').className = 'form-submit-btn';
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
      submitHandler(showRegister, login, password, email);
    });
    this.root = form;
    return form;
  }
}
