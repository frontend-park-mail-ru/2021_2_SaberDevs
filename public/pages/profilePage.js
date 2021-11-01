import BasePageMV from './basePageMV.js';
import ProfilePageView from './profilePageView.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';
import {profilePageActions} from '../flux/actions.js';

import Modal from '../components/modal/modal.js';

import Ajax from '../modules/ajax.js';
/**
 * Получить статьи текущего пользователя
 */
function uploadNextArticles() {
  const state = store.getState().profilePage;

  if (state.doNotUpload || state.isLoading) {
    if (ajaxDebug) {
      console.log('can\'t load userarticles as doNotUpload state flag is true');
    }
    return;
  }

  /**
   * Обработчик для ответа с сервера
   * @param {Object} articles
   */
  function onLoad(articles) {
    if (ajaxDebug) {
      console.log('more user articles loaded!');
    }

    store.dispatch(
        profilePageActions.saveNewArticles(
            articles.length?articles[articles.length-1].id : state.idLastLoaded,
            articles,
        ),
    );
  };

  store.dispatch(profilePageActions.setArticlesLoadingFlag());

  Ajax.get({
    // TODO: extend API idLastLoaded=${state.idLastLoaded ||
    // TODO: get login from profilePageState.user
    url: `/articles/author?login=${store.getState().authorization.login}`,
  })
      .then(({status, response}) => {
        if (status === Ajax.STATUS.ok) {
          onLoad(response.data);
          return;
        }

        if (status / 500 === 1) {
          Modal.setTitle(`Сервис временно не доступен: ${status}`);
        }
        if (status / 400 === 1) {
          Modal.setTitle(/* пользовательская */`Ошибка ${status}`);
        }
        Modal.setContent(response.msg);
        Modal.open(false);
      })
      .catch((err) => console.warn(err.message));
}

// ///////////////////////////////// //
//
//              Profile Page
//
// ///////////////////////////////// //

/**
 * @class ProfilePage
 * @module ProfilePage
 */
export default class ProfilePage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new ProfilePageView(root);
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();

    const state = store.getState().authorization;
    store.dispatch(
        changePageActions.changePage(
            'profile',
            `SaberProject | ${state.login}`,
        ),
    );

    if (store.getState().profilePage.articles.length === 0) {
      store.dispatch(uploadNextArticles);
    }

    // TODO: сделать scrolable именно статьи
    // const scrollable = document.querySelector('.content');
    // if (!scrollable) {
    //   console.error('нет дивака .content');
    // } else {
    //   scrollable.addEventListener(
    //       'scroll',
    //       newsFeedEndReachEventAction,
    //       false,
    //   );
    // }
  }

  /**
   * Скрыть подконтрольную страницу
   */
  hide() {
    super.hide();
    // TODO: сделать scrolable именно статьи
    // const scrollable = document.querySelector('.content');
    // if (!scrollable) {
    //   console.error('нет дивака .content');
    // } else {
    //   scrollable.removeEventListener(
    //       'scroll',
    //       newsFeedEndReachEventAction,
    //       false,
    //   );
    // }
  }

  /**
   * Вызывается в роутере. Если return не '', нужно выполнить переход
   * по пути, возвращенному из функции
   *
   * Возможны редиректы на: /login
   * @param {string} currentPath
   * @return {string}
   */
  redirect(currentPath) {
    if (store.getState().authorization.login !== '') {
      return '';
    }
    return '/login';
  }
}
