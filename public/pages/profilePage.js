import BasePageMV from './basePageMV.js';
import ProfilePageView from './profilePageView.js';

import store from '../flux/store';
import changePageActions from '../flux/actions/categoryPageActions';
import profilePageActions from '../flux/actions/profilePageActions';
import {AuthorizationTypes, EditorTypes} from '../flux/types';

import {showModalNetOrServerError} from '../components/modal/modalTemplates.js';

import Ajax from '../modules/ajax';
import Utils from '../common/utils.js';
import {ajaxDebug} from '../globals';

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
function newsFeedEndReachEventAction({currentTarget}) {
  const state = store.getState().profilePage;
  const trackedElement = currentTarget.querySelector('#feed__loading');
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
    url: `/articles/author?idLastLoaded=${state.idLastLoaded}` +
    `&login=${state.user.login}`,
  })
      .then(({status, response}) => {
        if (status === Ajax.STATUS.ok) {
          onLoad(response.data);
          return;
        }
        showModalNetOrServerError(status, response.msg);
      })
      .catch((err) => console.warn(err.message));
  store.dispatch(profilePageActions.unsetArticlesLoadingFlag());
}


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

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    store.subscribe(AuthorizationTypes.LOGOUT, () => {
      console.log('[ProfilePage] Logout reaction');
      if (document.URL.indexOf('/profile') !== -1) {
        Utils.redirect('/');
      }
    });

    // Если были на своей странице и сделали вход,
    // Перерисовываем страницу как профиль
    store.subscribe(AuthorizationTypes.LOGIN, () => {
      console.log('[ProfilePage] Login reaction');
      if (document.URL.indexOf('/profile') === -1 &&
          store.getState().profilePage.user.login ===
          store.getState().authorization.login) {
        Utils.redirect('/profile');
      }
    });

    // Обновить ленту, если есть изменения в статье или пользователь
    // опубликовал новую
    store.subscribe(EditorTypes.PUBLISH_ARTICLE, () => {
      store.dispatch(profilePageActions.clearArticles());
    });
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();
    const state = store.getState().profilePage;
    const authState = store.getState().authorization;

    // случай со сменой пользователя если эта страница уже открыта
    // isActive() вернет роутеру false и страница перерендерится
    // иногда этого делать не нужно: проверка this.view.isActive()
    // возвращает правду

    // берем login из урла и сверяемся, есть ли о юзере данные
    // или нужно загружать по сети
    // на странице /profile работаем только с авторизованным пользователем
    if (document.URL.indexOf('/profile') !== -1) {
      // уже открыт профиль
      // if ( state.user.login === authState.login) {
      //   return;
      // }
      store.dispatch(profilePageActions.setUserInfo(authState));
      store.dispatch(profilePageActions.clearArticles());
    } else {
      const userUrlParam = document.URL.slice(document.URL.indexOf('user/')+5);
      console.warn('[ProfilePage] user from Url ', document.URL, userUrlParam);
      // путь '/user/' не пропустится сервером, т.к. путь не проходит валидацию
      // для пути с параметром. Но доп. валидация нелишняя
      if (userUrlParam === '') {
        Utils.redirect('/404');
      }
      // уже открыт профиль этого пользователя
      if (this.view.isActive() && state.user.login === userUrlParam) {
        return;
      }
      if (userUrlParam !== state.user.login) {
        if (userUrlParam === authState.login) {
          Utils.redirect('/profile');
          return;
        }
        store.dispatch(profilePageActions.setUserLoading({
          login: userUrlParam,
        }));
        store.dispatch(profilePageActions.clearArticles());
        Ajax.get({url: `/user?user=${userUrlParam}`})
            .then(({status, response}) => {
              if (status === Ajax.STATUS.ok) {
                store.dispatch(profilePageActions.setUserInfo(response.data));
                return;
              }
              showModalNetOrServerError(status, response.msg);
              Utils.redirect('/');
            })
            .catch((err) => console.warn(err.message));
      }
    }

    store.dispatch(
        changePageActions.changePage(
            'profile',
            `SaberProject | ${state.user.login}`,
        ),
    );

    if (store.getState().profilePage.cards.length === 0) {
      store.dispatch(uploadNextArticles);
    }

    const scrollable = this.view.root.querySelector('.content');
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
   * @return {boolean}
   */
  isActive() {
    if (document.URL.endsWith('/profile') ||
        document.URL.indexOf('/user/') !== -1
    ) {
      return false;
    }
    return super.isActive();
  }

  /**
   * Скрыть подконтрольную страницу
   */
  hide() {
    super.hide();
    const scrollable = this.view.root.querySelector('.content');
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
    const authorizedUser = store.getState().authorization;

    // редирект с user/<login> на /profile обрабатыватеся
    // в самой страничке

    if (document.URL.indexOf('/profile') !== -1 &&
        !authorizedUser.isAuthenticated) {
      return '/login';
    }
    return '';
  }
}
