'use strict';

// pages & components
import MainPage from './pages/mainPage.js';
import ProfilePage from './pages/profilePage.js';
import SignupPage from './pages/signupPage.js';
import LinksController from './components/linksController.js';
import Router from './components/router.js';

// network
import {cookieLogin} from './modules/ajax_requests.js';

const root = document.getElementById('root');
const router = new Router(root);
const linksController = new LinksController(root);

// ///////////////////////////////// //
//
//            Сама страницы
//
// ///////////////////////////////// //
router
	.register('/', MainPage)
	.register('/profile', ProfilePage);
  // TODO:
	// .register('/signup', SignupPage);




// TODO: экран загрузки
cookieLogin();
linksController.enable();
router.start();
