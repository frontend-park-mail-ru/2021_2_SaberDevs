'use strict';

// TODO: разбить по функциональным элементам, выделить конфиг

/////////////////////////////////////
//
//          Globals
//
/////////////////////////////////////
const root = document.getElementById('root')

const menuElements = ['signup', 'login', 'profile']

const configuration = {
  main: {
    href: '/',
    name: "Главная",
    open: [
      mainPage
    ]
  },
  signup: {
    href: '/signup',
    name: "Регистрация",
    open: [
      () => {
        console.log("set IsRegistered to false");
        sessionParams.isRegistered = false;
      },
      signupPage
    ]
  },
  login: {
    href: '/login',
    name: "Авторизация",
    open: [
      () => {
        console.log("set IsRegistered to true");
        sessionParams.isRegistered = true;
      },
      signupPage
    ]
  },
  profile: {
    href: '/profile',
    name: "Профиль",
    //open: profilePage
  },

  // others (no menu)
  changeRegFormTypeBtn: {
    open: [
      switchIsRegistered,
      signupPage
    ]
  },
}

const sessionParams = {
  isRegistered: false,
}

/////////////////////////////////////
//
//          utils
//
/////////////////////////////////////

function switchIsRegistered() {
  sessionParams.isRegistered = !sessionParams.isRegistered;
  console.log("IsRegistered switched to " + sessionParams.isRegistered);
}

function createInput(type, placeholder, name) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;

  return input;
}

////////////////////////////////

//              Pages

////////////////////////////////

function mainPage() {
  // TODO: убрать в хедер и сайд-бар

  root.innerHTML = "";
  menuElements.map( (menu_el) => {
    if (!(menu_el in configuration)) {
      console.log("Error: " + menu_el + "is not described in configuration");
      return;
    }

    let {href, name} = configuration[menu_el];

    const menuElement = document.createElement('a');
    menuElement.href = href;
    menuElement.textContent = name;

    menuElement.dataset.section = menu_el;

    root.appendChild(menuElement);
  });
}


function signupPage() {
  let isRegistered = sessionParams.isRegistered;
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


  // интерефейс формы
  const submitBtn = document.createElement('input');
  submitBtn.type = 'submit';
  submitBtn.value = "Зарегистрироваться";

  const backBtn = document.createElement('a');
  backBtn.textContent = "Назад";
  backBtn.href = '/';
  backBtn.dataset.section = 'main';
  // backBtn.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   // перерисовываем меню заново
  //   mainPage();
  // });

  // const changeFormTypeBtn = document.createElement('button');
  // changeFormTypeBtn.type = "button";
  const changeFormTypeBtn = document.createElement('button');
  changeFormTypeBtn.textContent = isRegistered ? "Создать аккаунт" : "У меня уже есть аккаунт";
  changeFormTypeBtn.href = isRegistered ? "/login" : "/register";
  changeFormTypeBtn.dataset.section = "changeRegFormType"
  // changeFormTypeBtn.addEventListener("click", (e) => {
  //   sessionParams.isRegistered = !isRegistered;
  //   signupPage()
  // })

  form.appendChild(submitBtn);
  form.appendChild(backBtn);
  form.appendChild(changeFormTypeBtn);

  // форма
  root.appendChild(form);
}

////////////////////////////////
//
//       Сама страница
//
////////////////////////////////

mainPage()

// const signupLink = document.querySelector('[data-section="signup"]')
// signupLink.addEventListener('click', (e) => {
//   // ссылка больше не кликается (это было ее поведение по умолчанию)
//   e.preventDefault();
//   // рисуем нужную страницу по клику
//   signupPage(false);
// });

////////////////////////////////
//
//     Общий глобальный обработчик
//
////////////////////////////////

root.addEventListener('click', e => {
    const {target} = e;  // {target} - деструкторизация объекта. Равносильно target = e.target
    if (target instanceof HTMLAnchorElement) { // проверям, что клик был по ссылке (anchor)
          e.preventDefault();

          const actions_arr = configuration[target.dataset.section].open
          // TODO: check for undef
          // TODO: fix that
          console.log("targeter: " + target.href + " | " + actions_arr.lenght);

          actions_arr[0]();
          actions_arr[1]();
          // если target.dataset.section-ссылка описана в configuration, и у нее есть метод open, то он будет вызван
          for (let i = 0; i < actions_arr.lenght; i++) {
            configuration[target.dataset.section]?.open[i]();
            console.log(i + ": " + configuration[target.dataset.section].open[i])
          }
          
      }
  })
  