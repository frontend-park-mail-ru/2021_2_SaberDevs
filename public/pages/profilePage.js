import BasePageMV from './basePageMV.js';
import ProfilePageView from './profilePageView.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';

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
   *  Страница содержит главный компонент - карточку пользователя
   */
  render() {
    super.render();
    this.view.render(store.getState().authorization);
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    if (pageDebug) {
      console.log(`[PAGE ${this.constructor.name}]\tshow`);
    }

    const state = store.getState().authorization;
    this.view.show(state);
    store.dispatch(
        changePageActions.changePage(
            'profile',
            `SaberProject | ${state.login}`,
        ),
    );
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
