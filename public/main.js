'use strict';

// pages & components
import signupPage from "./pages/signupPage.js";
import profilePage from "./pages/profilePage.js";

const root = document.getElementById('root');

const menuElements = ['signup', 'login', 'profile'];

const state = {
  isAuthenticated: false,
  isRegistered: true,
  userData: {},
};

const configuration = {
  main: {
    href: '/',
    name: "Главная",
    open: {
      action: mainPage,
      props: null
    }
  },
  signup: {
    href: '/signup',
    name: "Регистрация",
    open: {
      action: (props) => {
        state.isRegistered = false;
        signupPage(props)
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          state.userData = props;
          profilePage(props);
        }, 
        isRegistered: false
      }
    }
  },
  login: {
    href: '/login',
    name: "Авторизация",
    open: {
      action: (props) => {
        state.isRegistered = true;
        signupPage(props);
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          profilePage(props);
        },
        isRegistered: true
      }
    },
  },
  profile: {
    href: '/profile',
    name: "Профиль",
    open: (state.isAuthenticated ? {
      action:  profilePage,
      props: state.userData
    } : {
      action: (props) => {
        state.isRegistered = true;
        signupPage(props);
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          profilePage(props);
        },
        isRegistered: true
      },
    }),
  },

  // others navigations (apart menu)

  // auth form
  changeRegFormType: {
    open: {
      action: (props) => {
        state.isRegistered = !state.isRegistered;
        props.isRegistered = state.isRegistered;
        signupPage(props)
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          state.userData = props;
          profilePage(props);
        },
      }
    },
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
//     действует только на ссылки
//
////////////////////////////////

root.addEventListener('click', e => {
    const {target} = e;  // {target} - деструкторизация объекта. Равносильно target = e.target
    if (target instanceof HTMLAnchorElement) {  // проверям, что клик был по ссылке (anchor)
          e.preventDefault();

          if (routerDebug) console.log("targeter: ", target.dataset.section)

          const props = configuration[target.dataset.section]?.open?.props;
          const action = configuration[target.dataset.section]?.open?.action;
          if (action !== undefined) {
            action.call(null, props);
          }
      }
  })
  