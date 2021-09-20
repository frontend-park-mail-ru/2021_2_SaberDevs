'use strict';

// pages & components
import signupPage from "./pages/signupPage.js";
import profilePage from "./pages/profilePage.js";
import mainPage from './pages/mainPage.js';

const root = document.getElementById('root');

const headerLinks = ['signup', 'login', 'profile'];
const sideBarLinks = ['hello'];

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
      props: {
        // монтируются сюда позже
        // headerLinks: createNavLinksArray(headerLinks),
        // sideBarLinks: createNavLinksArray(sideBarLinks),
        isAuthenticated: state.isAuthenticated,
        userData: state.userData,
      }
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
    // TODO: fix
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
        signupPage(props);
      },
      props: {
        onLogin: (props) => {
          state.isAuthenticated = true;
          state.userData = props;
          profilePage(props);
        },
      }
    },
  },

  template: {
    open : {
      action: () => {

      },
      props: null,
    }
  }
};

/////////////////////////////////////
//
//                utils
//
/////////////////////////////////////

function createNavLinksArray(linksConfigNameArray) {
  const res = [];

  linksConfigNameArray.map( (linkElement) => {
    if (!(linkElement in configuration)) {
      console.log("Error: " + linkElement + "is not described in configuration");
      return;
    }
  
    const {href, name} = configuration[linkElement];
  
    const headerNavLink = document.createElement('a');
    headerNavLink.href = href;
    headerNavLink.textContent = name;
  
    headerNavLink.dataset.section = linkElement;
  
    res.push(headerNavLink);
  });

  return res;
}

// небольшой костыль, чтобы исправить перекрестную ссылку: configuration ссылается на createNavLinkArray, createNavLinkArray использует configuration
// TODO: найти более элегантное решение
configuration.main.open.props.headerLinks = createNavLinksArray(headerLinks);
configuration.main.open.props.sideBarLinks = createNavLinksArray(sideBarLinks);

/////////////////////////////////////
//
//            Сама страница
//
/////////////////////////////////////

mainPage(configuration.main.open.props);

/////////////////////////////////////
//
//     Общий глобальный обработчик
//     действует только на ссылки
//
/////////////////////////////////////

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
  