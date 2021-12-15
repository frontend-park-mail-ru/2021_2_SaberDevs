// не используется. Перешли на вебпак
const cacheName = 'SaberDevs-Project';

// /dev/createCachedList.js заполняет этот список автоматически
const cacheUrls = [
  '/',
  './404.html',
  './favicon.ico',
  './index.html',
  './main.bandle.js',
  './main.css',
  './serviceWorker.js',
  './img/background-img.png',
  './img/background-space.png',
  './img/logo-for-sharing.png',
  './img/user_icon_loading.svg',
  './img/share/Daco_4064141.png',
  './img/share/odnoklassniki_PNG16.png',
  './img/share/Vk-icon.png',
  './img/share/VK.com-logo.svg',
  './img/icons/arrow.svg',
  './img/icons/comment.svg',
  './img/icons/comment_hover.svg',
  './img/icons/cross.svg',
  './img/icons/down.png',
  './img/icons/eye-closed.svg',
  './img/icons/eye-open.svg',
  './img/icons/key.svg',
  './img/icons/like.svg',
  './img/icons/like_hover.svg',
  './img/icons/mail.svg',
  './img/icons/menu.svg',
  './img/icons/search.svg',
  './img/icons/search_hover.svg',
  './img/icons/send.svg',
  './img/icons/share.svg',
  './img/icons/share_hover.svg',
  './img/icons/trash.svg',
  './img/icons/trash_hover.svg',
  './img/icons/up.png',
  './img/icons/username.svg',
  './fonts/Roboto-Light.ttf',
  './fonts/Roboto-Regular.ttf',
  './fonts/Roboto-Thin.ttf',
  './fonts/RussoOne-Regular.ttf',
  './fonts/Vollkorn-Italic-VariableFont_wght.ttf',
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
            console.log('[SW] on install: ', cacheName);
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

// Обработчик для пушей
self.addEventListener('push', (e) => {
  console.warn('[PushManager]: push event');
  const title = e.data.title || 'Это Ваш SaberNews!';
  const options = {
    icon: 'favicon.ico',
    image: 'logo-for-sharing.png',
    lang: 'ru-RU',
    vibrate: [200, 300, 200, 300],
    body: 'Народ умнеет, милорд',
  }
  e.waitUntil(
      self.registration.showNotification(title, options),
  );
});
