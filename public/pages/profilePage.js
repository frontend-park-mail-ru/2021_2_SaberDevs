import BasePageMV from './basePageMV.js';
import ProfilePageView from './profilePageView.js';

import store from '../flux/store.js';
import {changePageActions, profilePageActions} from '../flux/actions.js';

import Modal from '../components/modal/modal.js';

import Ajax from '../modules/ajax.js';
import Utils from '../utils.js';

// ///////////////////////////////// //
//
//             Profile Page
//
// ///////////////////////////////// //

/**
 * Обработчик scroll, который можно будет удалить
 * Проверяет, достигнут ли конец ленты
 * @param {event} event
 */
function newsFeedEndReachEventAction(event) {
  const state = store.getState().profilePage;
  const trackedElement = document.getElementById('feed__loading');
  // работаем, только если отслеживаемый элемент
  // находися в области видимости пользователя
  if (state.isLoading || state.isEndFound ||
    trackedElement.getBoundingClientRect().y > Utils.getUserWindowHeight()) {
    return;
  }
  console.log('[Profile Page] scroll trigger');
  store.dispatch(uploadNextArticles);
}

/**
 * Получить статьи текущего пользователя
 */
async function uploadNextArticles() {
  const state = store.getState().profilePage;

  if (state.isEndFound || state.isLoading) {
    if (ajaxDebug) {
      console.log('can\'t load usercards as isEndFound state flag is true');
    }
    return;
  }

  /**
   * Обработчик для ответа с сервера
   * @param {Object} cards
   */
  function onLoad(cards) {
    if (ajaxDebug) {
      console.log('[ProfilePage] more user cards loaded!');
    }

    store.dispatch(
        profilePageActions.saveNewArticles(
            cards.length ? cards[cards.length-1].id : state.idLastLoaded,
            cards,
        ),
    );
  };

  store.dispatch(profilePageActions.setArticlesLoadingFlag());

  await Ajax.get({
    // TODO: get login from profilePageState.user
    url: `/articles/author?idLastLoaded=${state.idLastLoaded}` +
    `&login=${store.getState().authorization.login}`,
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
  store.dispatch(profilePageActions.unsetArticlesLoadingFlag());
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

    if (store.getState().profilePage.cards.length === 0) {
      store.dispatch(uploadNextArticles);
    }

    const scrollable = document.querySelector('.content');
    if (!scrollable) {
      console.warn('[ProfilePage] нет дивака .content');
    } else {
      scrollable.addEventListener(
          'scroll',
          newsFeedEndReachEventAction,
      );
    }
  }

  /**
   * Скрыть подконтрольную страницу
   */
  hide() {
    super.hide();
    const scrollable = document.querySelector('.content');
    if (!scrollable) {
      console.warn('[ProfilePage] нет дивака .content');
    } else {
      scrollable.removeEventListener(
          'scroll',
          newsFeedEndReachEventAction,
      );
    }
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
