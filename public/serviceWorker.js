// import {cacheName, cacheUrls} from '../models/swCache.js';
const cacheName = 'SaberDevs-Project';

const cacheUrls = [
  '/',
  './404.html',
  './favicon.ico',
  './globals.js',
  './index.html',
  './main.js',
  './serviceWorker.js',
  './static/styles/style.scss',
  './static/styles/_base.scss',
  './static/styles/_layout.scss',
  './static/styles/_normilize.scss',
  './static/styles/_variables.scss',
  './static/styles/pages/_article-create.scss',
  './static/styles/pages/_article-view.scss',
  './static/styles/pages/_categories.scss',
  './static/styles/pages/_feed.scss',
  './static/styles/pages/_not-found.scss',
  './static/styles/pages/_profile.scss',
  './static/styles/pages/_settings.scss',
  './static/styles/css/style.css',
  './static/styles/components/_action-btns.scss',
  './static/styles/components/_buttons.scss',
  './static/styles/components/_comments.scss',
  './static/styles/components/_form.scss',
  './static/styles/components/_icon-changing.scss',
  './static/styles/components/_icon.scss',
  './static/styles/components/_loading.scss',
  './static/styles/components/_search.scss',
  './static/styles/components/_tags.scss',
  './static/styles/blocks/_card.scss',
  './static/styles/blocks/_header.scss',
  './static/styles/blocks/_mixins.scss',
  './static/styles/blocks/_modal.scss',
  './static/styles/blocks/_preview.scss',
  './static/styles/blocks/_profile-menu.scss',
  './static/styles/blocks/_sidebar.scss',
  './static/styles/blocks/_variables.scss',
  './static/img/320px-transparent.png',
  './static/img/background-img.png',
  './static/img/background-space.png',
  './static/img/computer.png',
  './static/img/users/user.jpg',
  './static/img/users/user_icon_loading.svg',
  './static/img/icons/comment.svg',
  './static/img/icons/comment_hover.svg',
  './static/img/icons/cross.svg',
  './static/img/icons/eye-closed.svg',
  './static/img/icons/eye-open.svg',
  './static/img/icons/key.svg',
  './static/img/icons/like.svg',
  './static/img/icons/like_hover.svg',
  './static/img/icons/mail.svg',
  './static/img/icons/search.svg',
  './static/img/icons/search_hover.svg',
  './static/img/icons/send.svg',
  './static/img/icons/share.svg',
  './static/img/icons/share_hover.svg',
  './static/img/icons/trash.svg',
  './static/img/icons/trash_hover.svg',
  './static/img/icons/username.svg',
  './static/img/cards/computer-336628_1280.jpg',
  './static/img/cards/conference-room-768441_1920.jpg',
  './static/img/cards/flower-4774929_1920.jpg',
  './static/img/cards/home-office-336377_1920.jpg',
  './static/img/cards/keyboard-254582_1920.jpg',
  './static/img/cards/life-2048978_1920.jpg',
  './static/img/cards/mobile-phone-1875813_1920.jpg',
  './static/img/cards/photographer-407068_1280.jpg',
  './static/img/cards/spain-86898_1280.jpg',
  './static/img/cards/startup-593343_1920.jpg',
  './static/img/cards/usb-1284227_1920.jpg',
  './static/css/loading.css',
  './pages/articleEditorPage.js',
  './pages/articleEditorView.js',
  './pages/articleReaderPage.js',
  './pages/articleReaderView.js',
  './pages/basePageMV.js',
  './pages/basePageView.js',
  './pages/categoryPage.js',
  './pages/categoryPageView.js',
  './pages/loadingScreen.js',
  './pages/mainPage.js',
  './pages/mainPageView.js',
  './pages/profilePage.js',
  './pages/profilePageView.js',
  './pages/profileSettingsPage.js',
  './pages/profileSettingsPageView.js',
  './pages/searchPage.js',
  './pages/searchPageView.js',
  './pages/signupPage.js',
  './pages/signupPageView.js',
  './pages/_createPage.js',
  './modules/ajax.js',
  './modules/ajaxRequests.js',
  './flux/actions.js',
  './flux/applyMiddleware.js',
  './flux/createStore.js',
  './flux/store.js',
  './flux/types.js',
  './flux/reducers/apiReducer.js',
  './flux/reducers/authorizeReducer.js',
  './flux/reducers/categoryPageReducer.js',
  './flux/reducers/changePageReducer.js',
  './flux/reducers/combineReducers.js',
  './flux/reducers/editorReducer.js',
  './flux/reducers/mainPageReducer.js',
  './flux/reducers/modalReducer.js',
  './flux/reducers/profilePageReducer.js',
  './flux/reducers/readerReducer.js',
  './flux/reducers/routerReducer.js',
  './flux/reducers/searchPageReducer.js',
  './flux/reducers/signupFormReducer.js',
  './flux/reducers/themeReducer.js',
  './flux/middleWares/asyncHandleThunk.js',
  './flux/actions/categoryPageActions.js',
  './flux/actions/editorActions.js',
  './flux/actions/readerActions.js',
  './flux/actions/routerActions.js',
  './flux/actions/searchActions.js',
  './components/imgPreloader.js',
  './components/linksController.js',
  './components/router.js',
  './components/_template/serviceWarning.js',
  './components/_template/serviceWarningView.js',
  './components/_basic/baseComponent.js',
  './components/_basic/baseComponentView.js',
  './components/signupForm/formRow.pug.js',
  './components/signupForm/signupForm.js',
  './components/signupForm/signupForm.pug.js',
  './components/signupForm/signupFormView.js',
  './components/sidebar/buttonNav.pug.js',
  './components/sidebar/sidebar.js',
  './components/sidebar/sidebar.pug.js',
  './components/sidebar/sidebarView.js',
  './components/sidebar/userPreview.pug.js',
  './components/settings/formSettingsRow.pug.js',
  './components/settings/formSettingsTextarea.pug.js',
  './components/settings/settings.pug.js',
  './components/settings/settingsForm.js',
  './components/settings/settingsFormView.js',
  './components/reader/articleReader.pug.js',
  './components/reader/comment.pug.js',
  './components/reader/reader.js',
  './components/reader/readerView.js',
  './components/profileCard/profileCard.js',
  './components/profileCard/profileCard.pug.js',
  './components/profileCard/profileCardView.js',
  './components/modal/modal.js',
  './components/modal/modal.pug.js',
  './components/modal/modalTemplates.js',
  './components/modal/serviceWarning.js',
  './components/modal/signupModal.js',
  './components/modal/serviceWarning/serviceWarning.js',
  './components/modal/serviceWarning/serviceWarningView.js',
  './components/loading/loading.pug.js',
  './components/header/header.js',
  './components/header/header.pug.js',
  './components/header/headerView.js',
  './components/feed/card.pug.js',
  './components/feed/feed.js',
  './components/feed/feed.pug.js',
  './components/feed/feedView.js',
  './components/feed/previews/mainPagePreviewBar.js',
  './components/feed/previews/mainPagePreviewBar.pug.js',
  './components/feed/previews/mainPagePreviewBarView.js',
  './components/editor/articleEditor.pug.js',
  './components/editor/editor.js',
  './components/editor/editorView.js',
  './components/editor/formArticleEditorRow.pug.js',
  './components/editor/formArticleEditorTextarea.pug.js',
  './components/editor/tag.pug.js',
  './components/categoryChoiceBar/categories.pug.js',
  './components/categoryChoiceBar/categoryChoiceBar.js',
  './components/categoryChoiceBar/categoryChoiceBar.pug.js',
  './components/categoryChoiceBar/categoryChoiceBarView.js',
  './common/categoriesList.js',
  './common/regexp.js',
  './common/regexpString.js',
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
