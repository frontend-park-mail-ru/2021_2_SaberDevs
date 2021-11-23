'use strict';

// eslint-disable-next-line no-unused-vars
import webSocket from './modules/webSocket.js';

// pages
import MainPage from './pages/mainPage.js';
import ProfilePage from './pages/profilePage.js';
import ProfileSettingsPage from './pages/profileSettingsPage.js';
import LoadingPage from './pages/loadingScreen.js';
import EditorPage from './pages/articleEditorPage.js';
import ReaderPage from './pages/articleReaderPage.js';
import CategoryPage from './pages/categoryPage.js';
import SignupPage from './pages/signupPage.js';
import SearchPage from './pages/searchPage.js';

// Controllers
import LinksController from './components/linksController.js';
import Router from './components/router.js';

// components
import SignupModal from './components/modal/signupModal.js';
import Warning from './components/modal/serviceWarning.js';
import ImgPreloader from './components/imgPreloader.js';

// network
import {logoutRequest} from './modules/ajaxRequests.js';
import {cookieLogin} from './modules/ajaxRequests.js';

// flux store
import store from './flux/store.js';

// Preload
ImgPreloader.upload([
  'static/img/background-space.png',
  'static/img/background.png',
  'static/img/icons/cross.svg',
  'static/img/icons/eye-closed.svg',
  'static/img/icons/eye-open.svg',
  'static/img/icons/key.svg',
  'static/img/icons/mail.svg',
  'static/img/icons/username.svg',
  'static/img/icons/like.svg',
  'static/img/icons/like_hover.svg',
  'static/img/icons/comment.svg',
  'static/img/icons/comment_hover.svg',
  'static/img/icons/share.svg',
  'static/img/icons/share_hover.svg',
  'static/img/icons/trash.svg',
  'static/img/icons/trash_hover.svg',
  'static/img/icons/search.svg',
  'static/img/icons/search_hover.svg',
  'static/img/icons/send.svg',
]);


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
    .registerPattern('/user/<login>', ProfilePage)
    .registerPattern('/article/<id>', ReaderPage)
    .register('/profile/settings', ProfileSettingsPage)
    .register('/editor', EditorPage)
    .registerPattern('/categories/<сategory>', CategoryPage)
    .register('/categories', CategoryPage)
    .register('/login', SignupPage)
    .register('/search', SearchPage);

linksController
    .register(
        'signupModal',
        SignupModal.show,
        true,
    )
    .register(
        'loginModal',
        SignupModal.show,
        false,
    )
    .register(
        'logout',
        () => {
          if (store.getState().authorization.isAuthenticated) {
            logoutRequest();
          }
        },
    )
    .register(
        'back',
        () => window.history.back(),
    );

loadingScreen.start();
(async function init() {
  await cookieLogin();
  await loadingScreen.end();
  linksController.enable();
  router.start();
})();
