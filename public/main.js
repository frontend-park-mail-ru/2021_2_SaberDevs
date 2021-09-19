'use strict';

// components
import {switchIsRegistered, signupPage, authCfg} from "./components/authorizationForm.js";
import profileComponent from "./components/profile.js"

// modules
// import Ajax from "modules/ajax.js"

// TODO: разбить по функциональным элементам, выделить конфиг

/////////////////////////////////////
//
//          Globals
//
/////////////////////////////////////
const root = document.getElementById('root');

const menuElements = ['signup', 'login', 'profile'];

const state = {
  isAuthenticated: true
};

const configuration = {
  main: {
    href: '/',
    name: "Главная",
    open: [
      {action: mainPage}
    ]
  },
  signup: {
    href: '/signup',
    name: "Регистрация",
    open: [
      {
        action: () => {
          console.log("set IsRegistered to false");
          authCfg.isRegistered = false;
        },
      },
      {
        action: signupPage,
        props: {onLogin: profilePage}
      }
    ]
  },
  login: {
    href: '/login',
    name: "Авторизация",
    open: [
      {
        action: () => {
          console.log("set IsRegistered to true");
          authCfg.isRegistered = true;
        },
      },
      {
        action: signupPage,
        props: {onLogin: profilePage}
      },
    ]
  },
  profile: {
    href: '/profile',
    name: "Профиль",
    open: [
      {
        action: profilePageTEST
      },
    ]
  },

  // others (no menu)

  // auth form
  changeRegFormType: {
    open: [
      {action: switchIsRegistered},
      {
        action: signupPage,
        props: {onLogin: profilePage}
      },
    ]
  }
};

/////////////////////////////////////
//
//          utils
//
/////////////////////////////////////

////////////////////////////////
//
//              Pages
//
////////////////////////////////

function mainPage() {
  // TODO: убрать в хедер и сайд-бар

  root.innerHTML = "";
  // root.title = "SaberProject";
  document.title = "SaberProject";
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

function profilePageTEST() {
  root.innerHTML = "";
  if (state.isAuthenticated) {
    setTimeout(() => {root.innerHTML = profileComponent({name: "Developer1000"})}, 1000);
    root.innerHTML = profileComponent({name: "Developer"});
  }
}

function profilePage(props) {
  console.log("ProfilePage props: ", JSON.stringify(props));
  root.innerHTML = "";
  if (state.isAuthenticated) {
    root.innerHTML = profileComponent(props);
  } else {
    signupPage({onLogin: profilePage});
  }
}

////////////////////////////////
//
//       Сама страница
//
////////////////////////////////

mainPage()

////////////////////////////////
//
//     Общий глобальный обработчик
//
////////////////////////////////

root.addEventListener('click', e => {
    const {target} = e;  // {target} - деструкторизация объекта. Равносильно target = e.target
    if (target instanceof HTMLAnchorElement) { // проверям, что клик был по ссылке (anchor)
          e.preventDefault();

          console.log("targeter: ", target.dataset.section)

          configuration[target.dataset.section]?.open.map(action => action.action(action.props));
      }
  })
  