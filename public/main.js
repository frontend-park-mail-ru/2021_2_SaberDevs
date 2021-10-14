'use strict';

// pages
import MainPage from './pages/mainPage.js';
import ProfilePage from './pages/profilePage.js';
import SignupPage from './pages/signupPage.js';

// Controllers
import LinksController from './components/linksController.js';
import Router from './components/router.js';

// components
import signupModal from './components/signupModal.js';

// network
import {logoutRequest} from './modules/ajax_requests.js';
import {cookieLogin} from './modules/ajax_requests.js';

// flux store
import store from './flux/store.js';

const root = document.getElementById('root');
const router = new Router(root);
const linksController = new LinksController(root);

// ///////////////////////////////// //
//
//        Настройки переходов
//
// ///////////////////////////////// //
router
  .register('/', MainPage)
  .register('/profile', ProfilePage)
//   .register('/login', LoginPage);
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

// TODO: экран загрузки
cookieLogin();
linksController.enable();
router.start();
