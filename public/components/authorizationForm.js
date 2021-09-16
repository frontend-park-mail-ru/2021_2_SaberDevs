import createInput from "../utils.js";
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

function signupPage() {
    let isRegistered = authCfg.isRegistered;
  
    document.title = "SaberProject | " + (!isRegistered? "Sign Up" : "Login");
    // стираем старые элементы, чтобы нарисовать новые
    root.innerHTML = "";
  
    const form = document.createElement('form');
  
    // поля формы
    let emailInput = null;
    let passwordRepeatInput = null;
    const loginInput = createInput("login", "Логин", "login");
    const passwordInput = createInput("password", "Пароль", "password");
    if (!isRegistered) {
      emailInput = createInput("email", "e-mail", "email");
      passwordRepeatInput = createInput("password", "Повторите пароль", "passwordRepeat");
    }
  
    if (!isRegistered) form.appendChild(emailInput);
    form.appendChild(loginInput);
    form.appendChild(passwordInput);
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
  }  
  
export {
    switchIsRegistered,
    signupPage,
    authCfg
}