import BaseComponent from '../_basic/baseComponent.js';
import SidebarView from './sidebarView.js';

import userPreviewComponent from './userPreview.pug.js';
import buttonNavComponent from './buttonNav.pug.js';

import store from '../../flux/store.js';
import {mainPageActions} from '../../flux/actions.js';
import {authorizationTypes} from '../../flux/types.js';
import editorActions from '../../flux/actions/editorActions.js';

/**
 * ViewModel-компонент соответсвующего View
 * @class Sidebar
 */
export default class Sidebar extends BaseComponent {
  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new SidebarView();

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    // Обновление вида сайдбара до создания подписки
    // на случай, если вход был совершен до инициализации
    if (store.getState().authorization.login !== '') {
      store.dispatch(
          (dispatch, getState) => dispatch(
              mainPageActions.toggleLogin(true, getState().authorization.login),
          ));
    }

    this.unsubscribes.push(store.subscribe(authorizationTypes.LOGIN, () => {
      store.dispatch(
          (dispatch, getState) => dispatch(
              mainPageActions.toggleLogin(true, getState().authorization.login),
          ));
      this.setSidebarUserPreview();
    }));

    this.unsubscribes.push(store.subscribe(authorizationTypes.LOGOUT, () => {
      store.dispatch(mainPageActions.toggleLogin(false, ''));
      this.setSidebarSignupButtons();
    }));
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    const state = store.getState().mainPage;

    let topBlockContent = '';
    if (!state.isAuthenticated) {
      topBlockContent += buttonNavComponent({
        href: '',
        data_section: 'loginModal',
        name: 'Логин',
      });
      topBlockContent += buttonNavComponent({
        href: '',
        data_section: 'signupModal',
        name: 'Регистрация',
      });
    } else {
      topBlockContent = userPreviewComponent({
        login: store.getState().authorization.login,
        avatarUrl: store.getState().authorization.avatarUrl,
      });
    }
    this.root = this.view.render(topBlockContent);
    this.view.root.querySelector('a.sidebar__nav-item').addEventListener(
        'click',
        () => store.dispatch(editorActions.createArticle()),
    );
    return this.root;
  }

  /**
   * Заполнить верхний блок сайдбара именем и
   * аватаркой пользователя, кнопкой "новая запись"
   */
  setSidebarUserPreview() {
    const state = store.getState().authorization;
    this.view.setTopBlockContent(userPreviewComponent(state));
  }

  /**
   * Заполнить верхний блок сайдбара кнопками "войти / зарегистрироваться"
   */
  setSidebarSignupButtons() {
    let topBlockContent = buttonNavComponent({
      href: '',
      data_section: 'loginModal',
      name: 'Логин',
    });
    topBlockContent += buttonNavComponent({
      href: '',
      data_section: 'signupModal',
      name: 'Регистрация',
    });
    this.view.setTopBlockContent(topBlockContent);
  }
}
