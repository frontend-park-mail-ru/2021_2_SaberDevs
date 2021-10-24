// import {cacheName, cacheUrls} from '../models/swCache.js';
const cacheName = 'SaberDevs-Project';

const cacheUrls = [
  '/',
  './404.html',
  './globals.js',
  './index.html',
  './main.js',
  './serviceWorker.js',
  './utils.js',
  './static/img/arrow-to-down.png',
  './static/img/comment.png',
  './static/img/company-name.png',
  './static/img/computer.png',
  './static/img/endOfFeed.png',
  './static/img/goose-grigoriy-1.jpg',
  './static/img/Laptop.png',
  './static/img/like.png',
  './static/img/loader-1-HorizontalBalls.gif',
  './static/img/loader-2-Flourish.gif',
  './static/img/menu-icon.png',
  './static/img/photo-elon-musk.jpg',
  './static/img/preview-example.jpg',
  './static/img/search-icon.png',
  './static/img/share.png',
  './static/img/sidebar-icons/calendar.png',
  './static/img/sidebar-icons/camera.png',
  './static/img/sidebar-icons/clock.png',
  './static/img/sidebar-icons/group.png',
  './static/img/sidebar-icons/question.png',
  './static/img/sidebar-icons/star.png',
  './static/img/sidebar-icons/subscribes.png',
  './static/css/content.css',
  './static/css/header.css',
  './static/css/main.css',
  './static/css/modal.css',
  './static/css/sidebar.css',
  './static/css/signup-form.css',
  './static/css/static-popup.css',
  './pages/basePageMV.js',
  './pages/basePageView.js',
  './pages/mainPage.js',
  './pages/mainPageView.js',
  './pages/profilePage.js',
  './pages/signupPage.js',
  './modules/ajax.js',
  './modules/ajaxRequests.js',
  './flux/actions.js',
  './flux/applyMiddleware.js',
  './flux/createStore.js',
  './flux/store.js',
  './flux/types.js',
  './flux/reducers/authorizeReducer.js',
  './flux/reducers/changePageReducer.js',
  './flux/reducers/combineReducers.js',
  './flux/reducers/mainPageReducer.js',
  './flux/reducers/modalReducer.js',
  './flux/reducers/signupFormReducer.js',
  './flux/reducers/template.js',
  './flux/reducers/themeReducer.js',
  './flux/middleWares/asyncHandleThunk.js',
  './components/buttonToMenu.js',
  './components/linksController.js',
  './components/modal.js',
  './components/router.js',
  './components/signupModal.js',
  './components/_template/templateComponent.js',
  './components/_template/templateView.js',
  './components/_basic/baseComponent.js',
  './components/_basic/baseComponentView.js',
  './components/signupForm/signupForm.js',
  './components/signupForm/signupFormView.js',
  './components/sidebar/sidebar.js',
  './components/sidebar/sidebar.pug.js',
  './components/sidebar/sidebarView.js',
  './components/profile/profile.pug.js',
  './components/header/header.js',
  './components/header/header.pug.js',
  './components/header/headerView.js',
  './components/feed/card.pug.js',
  './components/feed/feed.js',
];

// наименование для нашего хранилища кэша
// ссылки на кэшируемые файлы
self.addEventListener('install', (event) => {
  // задержим обработку события
  // если произойдёт ошибка, serviceWorker не установится
  event.waitUntil(
      // находим в глобальном хранилище Cache-объект с нашим именем
      // если такого не существует, то он будет создан
      caches.open(cacheName)
          .then((cache) => {
            // загружаем в наш cache необходимые файлы
            console.warn('on install: ', cacheName);
            return cache.addAll(cacheUrls);
          })
          .catch((err) => {
            console.error('smth went wrong with caches.open: ', err);
          }),
  );
});
self.addEventListener('fetch', (event) => {
  /** online first */
  if (navigator.onLine === true) {
    return fetch(event.request);
  }

  /** cache first */
  event.respondWith(
      // ищем запрашиваемый ресурс в хранилище кэша
      caches
          .match(event.request)
          .then((cachedResponse) => {
            // выдаём кэш, если он есть
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(event.request);
          })
          .catch((err) => {
            console.error('smth went wrong with caches.match: ', err);
          }),
  );
});
