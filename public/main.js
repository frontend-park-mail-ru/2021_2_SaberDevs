'use strict';

// pages & components
import mainPage from './pages/mainPage.js';
import linksController from './components/linksController.js';

// network
import {cookieLogin} from './modules/ajax_requests.js';

const root = document.getElementById('root');

// ///////////////////////////////// //
//
//            Сама страница
//
// ///////////////////////////////// //

linksController.enable();
// TODO: экран загрузки
cookieLogin();
mainPage();
