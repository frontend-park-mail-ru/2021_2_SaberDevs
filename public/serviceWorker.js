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
  './pages/BasePageMV.js',
  './pages/mainPage.js',
  './pages/profilePage.js',
  './pages/signupPage.js',
  './modules/ajax.js',
  './modules/ajaxRequests.js',
  './models/authorization.js',
  './models/mainPageConfig.js',
  './models/page.js',
  './flux/actions.js',
  './flux/createStore.js',
  './flux/reducers.js',
  './flux/store.js',
  './flux/types.js',
  './components/buttonToMenu.js',
  './components/card.pug.js',
  './components/header.pug.js',
  './components/linksController.js',
  './components/modal.js',
  './components/newsBar.pug.js',
  './components/profile.pug.js',
  './components/router.js',
  './components/sidebar.pug.js',
  './components/signupForm.js',
  './components/signupModal.js',
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
