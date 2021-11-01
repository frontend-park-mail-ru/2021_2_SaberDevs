import BaseComponent from '../_basic/baseComponent.js';
import SidebarView from './sidebarView.js';

import userPreviewComponent from './userPreview.pug.js';
import buttonNavComponent from './buttonNav.pug.js';

import store from '../../flux/store.js';
import {mainPageActions} from '../../flux/actions.js';
import {authorizationTypes} from '../../flux/types.js';

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

    // Обновление вида хедера до создания подписки
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
        name: store.getState().authorization.firstName,
        img: store.getState().authorization.avatar,
      });
    }
    this.root = this.view.render(topBlockContent);
    return this.root;
  }

  /**
   * Заполнить верхний блок сайдбара именем и
   * аватаркой пользователя, кнопкой "новая запись"
   */
  setSidebarUserPreview() {
    const state = store.getState().authorization;
    this.view.setTopBlockContent(
        userPreviewComponent({
          name: state.firstName,
          img: state.avatar,
        }));
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
