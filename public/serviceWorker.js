// import {cacheName, cacheUrls} from '../models/swCache.js';
const cacheName = 'SaberDevs-Project';

const cacheUrls = [
  '/',
  './404.html',
  './favicon.ico',
  './globals.js',
  './index-no-webpack.html',
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
  './static/styles/pages/_loading-page.scss',
  './static/styles/pages/_not-found.scss',
  './static/styles/pages/_profile.scss',
  './static/styles/pages/_settings.scss',
  './static/styles/mobile/_mobile.scss',
  './static/styles/fonts/_fonts.scss',
  './static/styles/fonts/Vollkorn/Vollkorn-Italic-VariableFont_wght.ttf',
  './static/styles/fonts/Vollkorn/Vollkorn-VariableFont_wght.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-Black.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-BlackItalic.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-Bold.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-BoldItalic.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-ExtraBold.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-ExtraBoldItalic.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-Italic.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-Medium.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-MediumItalic.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-Regular.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-SemiBold.ttf',
  './static/styles/fonts/Vollkorn/static/Vollkorn-SemiBoldItalic.ttf',
  './static/styles/fonts/Russo_One/RussoOne-Regular.ttf',
  './static/styles/fonts/Roboto/LICENSE.txt',
  './static/styles/fonts/Roboto/Roboto-BlackItalic.ttf',
  './static/styles/fonts/Roboto/Roboto-Bold.ttf',
  './static/styles/fonts/Roboto/Roboto-BoldItalic.ttf',
  './static/styles/fonts/Roboto/Roboto-Italic.ttf',
  './static/styles/fonts/Roboto/Roboto-Light.ttf',
  './static/styles/fonts/Roboto/Roboto-LightItalic.ttf',
  './static/styles/fonts/Roboto/Roboto-Medium.ttf',
  './static/styles/fonts/Roboto/Roboto-MediumItalic.ttf',
  './static/styles/fonts/Roboto/Roboto-Regular.ttf',
  './static/styles/fonts/Roboto/Roboto-Thin.ttf',
  './static/styles/fonts/Roboto/Roboto-ThinItalic.ttf',
  './static/styles/css/style.css',
  './static/styles/components/_action-btns.scss',
  './static/styles/components/_buttons.scss',
  './static/styles/components/_comments.scss',
  './static/styles/components/_form.scss',
  './static/styles/components/_icon-changing.scss',
  './static/styles/components/_icon.scss',
  './static/styles/components/_loading.scss',
  './static/styles/components/_search.scss',
  './static/styles/components/_stream-comment.scss',
  './static/styles/components/_tags.scss',
  './static/styles/blocks/_card.scss',
  './static/styles/blocks/_header.scss',
  './static/styles/blocks/_mixins.scss',
  './static/styles/blocks/_modal.scss',
  './static/styles/blocks/_preview.scss',
  './static/styles/blocks/_profile-menu.scss',
  './static/styles/blocks/_sidebar.scss',
  './static/styles/blocks/_variables.scss',
  './static/img/background-img.png',
  './static/img/background-space.png',
  './static/img/user_icon_loading.svg',
  './static/img/icons/arrow.svg',
  './static/img/icons/comment.svg',
  './static/img/icons/comment_hover.svg',
  './static/img/icons/cross.svg',
  './static/img/icons/eye-closed.svg',
  './static/img/icons/eye-open.svg',
  './static/img/icons/key.svg',
  './static/img/icons/like.svg',
  './static/img/icons/like_hover.svg',
  './static/img/icons/mail.svg',
  './static/img/icons/menu.svg',
  './static/img/icons/search.svg',
  './static/img/icons/search_hover.svg',
  './static/img/icons/send.svg',
  './static/img/icons/share.svg',
  './static/img/icons/share_hover.svg',
  './static/img/icons/trash.svg',
  './static/img/icons/trash_hover.svg',
  './static/img/icons/username.svg',
  './pages/articleEditorPage.js',
  './pages/articleEditorView.js',
  './pages/articleReaderPage.js',
  './pages/articleReaderPageView.js',
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
  './modules/webSocket.js',
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
  './flux/reducers/streamReducer.js',
  './flux/reducers/themeReducer.js',
  './flux/middleWares/asyncHandleThunk.js',
  './flux/actions/categoryPageActions.js',
  './flux/actions/editorActions.js',
  './flux/actions/readerActions.js',
  './flux/actions/routerActions.js',
  './flux/actions/searchActions.js',
  './flux/actions/streamActions.js',
  './components/imgPreloader.js',
  './components/linksController.js',
  './components/router.js',
  './components/_template/serviceWarning.js',
  './components/_template/serviceWarningView.js',
  './components/_onAvatarErrorMixin/_onAvatarErrorMixin.pug.js',
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
  './components/sidebar/streamComment.pug.js',
  './components/sidebar/userPreview.pug.js',
  './components/settings/formSettingsRow.pug.js',
  './components/settings/formSettingsTextarea.pug.js',
  './components/settings/settings.pug.js',
  './components/settings/settingsForm.js',
  './components/settings/settingsFormView.js',
  './components/reader/articleAddComment.pug.js',
  './components/reader/articleReader.pug.js',
  './components/reader/comment.pug.js',
  './components/reader/reader.js',
  './components/reader/readerView.js',
  './components/profileCard/profileCard.js',
  './components/profileCard/profileCard.pug.js',
  './components/profileCard/profileCardView.js',
  './components/nav-items/nav-items.pug.js',
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
  './components/feed/composeCardStandart.js',
  './components/feed/composeUsers.js',
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
  './components/avatarMixin/avatarMixin.pug.js',
  './common/categoriesList.js',
  './common/mobileLayout.js',
  './common/regexp.js',
  './common/regexpString.js',
  './common/transformApi.js',
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
