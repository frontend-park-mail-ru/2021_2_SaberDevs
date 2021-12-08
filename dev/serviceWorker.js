// не используется. Перешли на вебпак
const cacheName = 'SaberDevs-Project';

// createCachedList заполнит список
const cacheUrls = [
  '/',
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
