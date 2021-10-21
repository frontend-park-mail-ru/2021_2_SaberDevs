import BasePageMV from './basePageMV.js';

import profileComponent from '../components/profile.pug.js';
import createToMenuBtn from '../components/buttonToMenu.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';

/**
 * @class ProfilePage
 * @module ProfilePage
 */
export default class ProfilePage extends BasePageMV {
  /**
   * @param {HTMLElement} rootElement
   */
  constructor(rootElement) {
    super(rootElement);
  }

  /**
   * Показать элемент. Вызывает render() для обновления.
   */
  show() {
    super.show();
    if (routerDebug) {
      console.log('ProfilePage show');
    }
  }
  /**
   * Скрыть элемент
   */
  hide() {
    super.hide();
    if (routerDebug) {
      console.log('ProfilePage hide');
    }
  }

  /**
   * Вызывается в роутере. Если return не '', нужно выполнить переход
   * по пути, возвращенному из функции
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

  /**
 * Страница содержит главный компонент - карточку пользователя
 */
  render() {
    if (routerDebug) {
      console.log('ProfilePage render');
    }
    const root = this.rootElement;
    const state = store.getState().authorization;
    store.dispatch(
        changePageActions.changePage(
            'profile',
            `SaberProject | ${state.login}`,
        ),
    );

    root.innerHTML = '';

    const profile = document.createElement('div');
    profile.innerHTML = profileComponent(state);

    const backBtn = createToMenuBtn();

    root.appendChild(profile);
    root.appendChild(backBtn);
  }
}
