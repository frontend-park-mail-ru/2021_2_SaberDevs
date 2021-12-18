import BaseComponentView from '../_basic/baseComponentView.js';
import signupFormComponent from './signupForm.pug.js';
import formRowComponent from './formRow.pug.js';

import regexp from '../../common/regexp.js';


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
      const formWarningLabel = this.root.querySelector('#form-warning-label');
      if (!formWarning) {
        console.warn(`[SignupFormView]
          appendWarning call while SignupForm was not rendered`);
      }
      formWarning.style.display = 'block';
      formWarningLabel.classList.add('form__warning-label-show');
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

    const loginRow = formRowComponent({
      label: 'Логин',
      type: 'text',
      name: 'login',
      required: true,
    });
    formRows += loginRow;

    if (showRegister) {
      const emailRow = formRowComponent({
        label: 'e-mail',
        type: 'email',
        name: 'email',
        required: true,
      });
      formRows += emailRow;
    }

    const passwordRow = formRowComponent({
      label: 'Пароль',
      type: 'password',
      name: 'password',
      required: true,
      eye: true,
    });
    formRows += passwordRow;

    if (showRegister) {
      const passwordRepeatRow = formRowComponent({
        label: 'Повтор пароля',
        type: 'password',
        name: 'password-repeat',
        required: true,
        eye: false,
      });
      formRows += passwordRepeatRow;
    }

    const formWrapper = document.createElement('div');
    formWrapper.innerHTML = signupFormComponent({
      title: showRegister ? 'Регистрация' : 'Вход',
      form_rows: formRows,
      submit_btn_placeholder: showRegister ? 'Зарегистрироваться' : 'Войти',
    });
    const form = formWrapper.firstChild;

    form.querySelector('.control-password').addEventListener('click',
        ({target}) => {
          const passwordInput = form.querySelector('input[name="password"]');
          if (passwordInput.getAttribute('type') === 'password') {
            target.classList.add('password__show');
            passwordInput.type = 'text';
          } else {
            target.classList.remove('password__show');
            passwordInput.type ='password';
          }
        });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // убираем сообщения об ошибках от предыдущих попыток
      const formWarning = form.querySelector('.form__warning');
      const formWarningLabel = this.root.querySelector('#form-warning-label');
      formWarning.style.display = 'none';
      formWarning.textContent = '';
      formWarningLabel.classList.remove('form__warning-label-show');

      const login = form.querySelector('input[name="login"]').value;
      const password = form.querySelector('input[name="password"]').value;
      const emailInput = form.querySelector('input[name="email"]');
      const email = emailInput?.value;
      const passRepInput = form.querySelector('input[name="password-repeat"]');
      const passwordRepeated = passRepInput?.value;

      if (!regexp.login.test(login)) {
        formWarning.style.display = 'block';
        formWarningLabel.classList.add('form__warning-label-show');
        formWarning.textContent = 'Логин - это латинские буквы, цифры и ' +
            'нижнее подчеркивание (_). Длина логина - от 4 до 20 символов';
        return;
      }

      if (!regexp.password.test(password)) {
        formWarning.style.display = 'block';
        formWarningLabel.classList.add('form__warning-label-show');
        formWarning.textContent = 'В качестве пароля используйте любую ' +
            'комбинацию непробельных символы длиной более 8';
        return;
      }

      // если пароли не совпадают
      if (showRegister && passwordRepeated !== password) {
        formWarning.style.display = 'block';
        formWarningLabel.classList.add('form__warning-label-show');
        formWarning.textContent = 'Удостоверьтесь, что пароли совпадают';
        return;
      }
      // Пустые значения не пропускаются благодаря свойству required
      submitHandler(showRegister, login, password, email);
    });

    this.root = form;
    return form;
  }
}
