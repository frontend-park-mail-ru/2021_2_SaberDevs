import BaseComponentView from '../_basic/baseComponentView.js';
import signupFormComponent from './signupForm.pug.js';
import formRowComponent from './formRow.pug.js';

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
    const loginInput = formRowComponent({
      label: 'Логин',
      type: 'text',
      name: 'login',
      placeholder: 'Введите логин...',
      pattern: '^[a-zA-Z][a-zA-Z0-9_]{4,20}$',
    });
    formRows += loginInput;

    if (showRegister) {
      const emailInput = formRowComponent({
        label: 'Почта',
        type: 'email',
        name: 'email',
        placeholder: 'Введите почту...',
        pattern: '.*',
      });
      formRows += emailInput;
    }

    const passwordInput = formRowComponent({
      label: 'Пароль',
      type: 'password',
      name: 'password',
      placeholder: 'Введите пароль...',
      pattern: '^\\S{8,40}$',
      // '^[A-Za-z0-9.,\\/#!$%\\^&\\*;:{}=\\-_`~()]{8,40}$';
      // '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,256}$';
    });
    formRows += passwordInput;

    if (showRegister) {
      const passwordRepeatInput = formRowComponent({
        label: 'Повтор пароля',
        type: 'password',
        name: 'password-repeat',
        placeholder: 'Введите пароль повторно...',
        pattern: '^\\S{8,40}$',
      });
      formRows += passwordRepeatInput;
    }

    const formWrapper = document.createElement('div');
    formWrapper.innerHTML = signupFormComponent({
      title: showRegister ? 'Регистрация' : 'Вход',
      form_rows: formRows,
      submit_btn_placeholder: showRegister ? 'Зарегистрироваться' : 'Войти',
    });

    const form = formWrapper.firstChild;

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
