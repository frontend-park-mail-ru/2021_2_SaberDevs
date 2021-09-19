// import profileComponent from "./profile.js"
import {createInput, createLabel} from "../utils.js";
import Ajax from "../modules/ajax.js";
/////////////////////////////////////
//
//          Globals
//
/////////////////////////////////////

const authCfg = {
    isRegistered: false,
};

/////////////////////////////////////
//
//          utils
//
/////////////////////////////////////

function switchIsRegistered() {
    authCfg.isRegistered = !authCfg.isRegistered;
    console.log("IsRegistered switched to " + authCfg.isRegistered);
};

////////////////////////////////
//
//         Page Content
//
////////////////////////////////

function signupPage({onLogin}) {
    let isRegistered = authCfg.isRegistered;
  
    document.title = "SaberProject | " + (!isRegistered? "Sign Up" : "Login");
    // стираем старые элементы, чтобы нарисовать новые
    root.innerHTML = "";
  
    const form = document.createElement('form');
  
    // поля формы
    let emailInput = null;
    let passwordRepeatInput = null;
    const loginInput = createInput("login", "Логин", "login", true);
    const loginLabel = createLabel("login", "4-20 символов, первый символ - буква");
    const passwordInput = createInput("password", "Пароль", "password", true);
    const passwordLabel = createLabel("password", "8-256 символов, минимум 4 заглавных и строчных латинских буквы");
    if (!isRegistered) {
      emailInput = createInput("email", "e-mail", "email", true);
      passwordRepeatInput = createInput("password", "Повторите пароль", "passwordRepeat", true);
    }

    // html5-свойства полей
    // https://habr.com/ru/post/545150/  - про регулярки
    loginInput.autofocus = true;
    loginInput.minlength = 5;
    loginInput.maxLength = 20;
    loginInput.pattern = "^[[:alpha:]][[:word:]]{4,20}$";

    passwordInput.minLength = 8;
    passwordInput.maxLength = 256;
    passwordInput.pattern ="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,256}$";

    if (!isRegistered) {
        emailInput.maxLength = 100;
        passwordRepeatInput.maxLength = 8;
        passwordRepeatInput.maxLength = 256;
    }
  
    form.appendChild(loginInput);
    form.appendChild(loginLabel);
    if (!isRegistered) form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(passwordLabel);
    if (!isRegistered) form.appendChild(passwordRepeatInput);
  
  
    // интерфейс формы
    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = isRegistered ? "Войти" : "Зарегистрироваться";
  
    const backBtn = document.createElement('a');
    backBtn.textContent = "Назад";
    backBtn.href = '/';
    backBtn.dataset.section = 'main';

    const changeFormTypeBtn = document.createElement('a');
    changeFormTypeBtn.textContent = isRegistered ? "Создать аккаунт" : "У меня уже есть аккаунт";
    changeFormTypeBtn.href = !isRegistered ? "/login" : "/register";
    changeFormTypeBtn.dataset.section = "changeRegFormType"

    form.appendChild(submitBtn);
    form.appendChild(backBtn);
  
    // форма
    root.appendChild(form);
    root.appendChild(changeFormTypeBtn);

    // submit action
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // TODO: validation & trimming
      const login = loginInput.value;
      const password = passwordInput.value;
      const email = emailInput?.value;
      const passwordRepeated = passwordRepeatInput?.value;

      // если пароли не совпадают
      if (!isRegistered && passwordRepeated !== password) {
        const warningLabel = document.createElement("label");
        warningLabel.textContent = "Пароли должны совпасть. Старайтесь";
        warningLabel.htmlFor = "passwordRepeat";
        passwordRepeatInput.insertAdjacentHTML('afterend', warningLabel.outerHTML); 
        return;
      }

      Ajax.post({
          url: isRegistered ? '/login' : '/signup',
          // TODO: encryption
          body: {login, email, password},
          callback: (status, msg) => {
            
            if (status === Ajax.STATUS.ok) {
                console.log("Status: ", status, "msg: ", msg);
                //profileComponent({name: login});
                onLogin(JSON.parse(msg).data);
                return;
            }

            if (status === Ajax.STATUS.badRequest) {
                console.log("Status: ", status, "msg: ", msg);
            }

            alert('ошибка сети' + status + '\n' + msg);
          }
      });
  });
} 
  
export {
    switchIsRegistered,
    signupPage,
    authCfg
}