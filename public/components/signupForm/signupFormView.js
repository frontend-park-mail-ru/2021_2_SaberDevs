import BaseComponentView from '../_basic/baseComponentView.js';
import signupFormComponent from './signupForm.pug.js';
import formRowComponent from './formRow.pug.js';
import {createInput} from '../../utils.js';

/**
 * @class SignupFormView
 */
export default class SignupFormView extends BaseComponentView {
  /**
   * Изменяемый элемент
   */
  constructor() {
    super();
    this.root = document.createElement('div');
    this.appendWarning = (msg) => {
      const formWarning = this.root.querySelector('.form__warning');
      if (!formWarning) {
        console.warn(`[SignupFormView]
          appendWarning call while SignupForm was not rendered`);
      }
      formWarning.style.display = 'block';
      formWarning.textContent = msg;
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
    let formRows = '';
    const loginInput = createInput('login', '', 'login', '', true,
        '^[a-zA-Z][a-zA-Z0-9_]{4,20}$');
    loginInput.className = 'form__input';

    const loginRow = formRowComponent({
      label: 'Логин',
      field: loginInput.outerHTML,
    });
    formRows += loginRow;

    if (showRegister) {
      const emailInput = createInput('email', '', 'email', '', true);
      emailInput.className = 'form__input';

      const emailRow = formRowComponent({
        label: 'Почта',
        field: emailInput.outerHTML,
      });
      formRows += emailRow;
      console.log('emailInput: ', emailRow);
    }

    const passwordInputWrapper = document.createElement('div');
    const passwordInput = createInput('password', '', 'password', '',
        true, '^\\S{8,40}$');
    // '^[A-Za-z0-9.,\\/#!$%\\^&\\*;:{}=\\-_`~()]{8,40}$';
    // '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,256}$';
    passwordInput.className = 'form__input';
    const passwordShowBtn = document.createElement('a');
    passwordShowBtn.className = 'password__control-btn';
    passwordShowBtn.classList.add('control-password');

    passwordInputWrapper.appendChild(passwordInput);
    passwordInputWrapper.appendChild(passwordShowBtn);

    const passwordRow = formRowComponent({
      label: 'Пароль',
      field: passwordInputWrapper.innerHTML,
    });
    formRows += passwordRow;

    if (showRegister) {
      const passwordInputWrapper = document.createElement('div');
      const passwordInput = createInput('password', '', 'password-repeat', '',
          true, '^\\S{8,40}$');
      passwordInput.className = 'form__input';
      const passwordShowBtn = document.createElement('a');
      passwordShowBtn.className = 'password__control-btn';
      passwordShowBtn.classList.add('control-password-repeat');

      passwordInputWrapper.appendChild(passwordInput);
      passwordInputWrapper.appendChild(passwordShowBtn);

      const passwordRow = formRowComponent({
        label: 'Повтор пароля',
        field: passwordInputWrapper.innerHTML,
      });
      formRows += passwordRow;
    }

    const formWrapper = document.createElement('div');
    formWrapper.innerHTML = signupFormComponent({
      title: showRegister ? 'Регистрация' : 'Вход',
      form_rows: formRows,
      submit_btn_placeholder: showRegister ? 'Зарегистрироваться' : 'Войти',
    });

    const form = formWrapper.firstChild;

    console.log('formWrapper:', formWrapper);
    const btnPassword = formWrapper
        .getElementsByClassName('control-password')[0];
    btnPassword.addEventListener('click', ({target}) => {
      const inputBtn = document.getElementById('input-password');
      if (inputBtn.getAttribute('type') === 'password') {
        target.classList.add('password__show');
        inputBtn.setAttribute('type', 'text');
      } else {
        target.classList.remove('password__show');
        inputBtn.setAttribute('type', 'password');
      }
    });
    if (showRegister) {
      const btnPasswordRepeat = formWrapper
          .getElementsByClassName('control-password-repeat')[0];
      btnPasswordRepeat.addEventListener('click', ({target}) => {
        const inputBtn = document.getElementById('input-password-repeat');
        if (inputBtn.getAttribute('type') === 'password') {
          target.classList.add('password__show');
          inputBtn.setAttribute('type', 'text');
        } else {
          target.classList.remove('password__show');
          inputBtn.setAttribute('type', 'password');
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // убираем сообщения об ошибках от предыдущих попыток
      const formWarning = form.querySelector('.form__warning');
      formWarning.style.display = 'none';
      formWarning.textContent = '';

      const login = form.querySelector('input[name="login"]').value;
      const password = form.querySelector('input[name="password"]').value;
      const emailInput = form.querySelector('input[name="email"]');
      const email = emailInput?.value;
      const passRepInput = form.querySelector('input[name="password-repeat"]');
      const passwordRepeated = passRepInput?.value;

      // если пароли не совпадают
      if (showRegister && passwordRepeated !== password) {
        formWarning.style.display = 'block';
        formWarning.textContent = 'Пароли должны совпасть. Старайтесь';
        return;
      }
      // Пустые значения не пропускаются благодаря свойству required
      submitHandler(showRegister, login, password, email);
    });

    this.root = form;
    return form;
  }
}
