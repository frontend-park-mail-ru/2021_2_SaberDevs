// 'use strict';

import {switchIsRegistered, signupPage, authCfg} from "./components/authorizationForm.js";

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
        authCfg.isRegistered = false;
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
        authCfg.isRegistered = true;
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
  changeRegFormType: {
    open: [
      switchIsRegistered,
      signupPage
    ]
  },
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

          configuration[target.dataset.section]?.open.map(action => action())
      }
  })
  