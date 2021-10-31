'use strict';

// pages
import MainPage from './pages/mainPage.js';
import ProfilePage from './pages/profilePage.js';
import ProfileSettingsPage from './pages/profileSettingsPage.js';
// import SignupPage from './pages/signupPage.js';
import LoadingPage from './pages/loadingScreen.js';

// Controllers
import LinksController from './components/linksController.js';
import Router from './components/router.js';

// components
import signupModal from './components/modal/signupModal.js';
import Warning from './components/modal/serviceWarning.js';

// network
import {logoutRequest} from './modules/ajaxRequests.js';
import {cookieLogin} from './modules/ajaxRequests.js';

// flux store
import store from './flux/store.js';

// ServiceWorker
const SWJSFile = 'serviceWorker.js';

if ('serviceWorker' in navigator && !disableSW) {
  navigator.serviceWorker.register(SWJSFile, {scope: '/'})
      .then((registration) => {
        console.warn('sw registration on scope:', registration.scope);
      })
      .catch((err) => {
        console.error(err);
      });
} else {
  console.warn('ServiceWorker is unable in navigator');
}

const root = document.getElementById('root');
const router = new Router(root);
const linksController = new LinksController(root);
// экран загрузки
const loadingScreen = new LoadingPage();

Warning.init();
// ///////////////////////////////// //
//
//        Настройки переходов
//
// ///////////////////////////////// //
router
    .register('/', MainPage)
    .register('/profile', ProfilePage)
    .register('/profile/settings', ProfileSettingsPage);
// .register('/login', LoginPage);
// TODO:
// .register('/signup', SignupPage);

linksController
    .register(
        'signupModal',
        signupModal,
        true)
    .register(
        'loginModal',
        signupModal,
        false)
    .register(
        'logout',
        () => {
          if (store.getState().mainPage.isAuthenticated) {
            logoutRequest();
          }
        })
    .register(
        'search__button',
        searchField)
    .register(
        'back',
        window.history.back,
    );

loadingScreen.start();
(async function init() {
  await cookieLogin();
  await loadingScreen.end();
  linksController.enable();
  router.start();
})();
