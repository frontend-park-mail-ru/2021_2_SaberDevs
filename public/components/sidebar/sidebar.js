import BaseComponent from '../_basic/baseComponent.js';
import SidebarView from './sidebarView.js';

// TODO: перенести во вью. Сделать ручки
import userPreviewComponent from './userPreview.pug.js';
import buttonNavComponent from './buttonNav.pug.js';

import store from '../../flux/store.js';
import {mainPageActions} from '../../flux/actions.js';
import {authorizationTypes} from '../../flux/types.js';

/**
 * Заполнить верхний блок сайдбара именем и
 * аватаркой пользователя, кнопкой "новая запись"
 */
function setSidebarUserPreview() {
  // TODO: вынести во вью
  const topBlockContentDiv = document.getElementById('sidebarTopBlockContent');
  const state = store.getState().authorization;
  topBlockContentDiv.innerHTML = userPreviewComponent({
    name: state.name,
    url: `/profile`,
    img: state.avatar,
  });
}

/**
 * Заполнить верхний блок сайдбара кнопками "войти / зарегистрироваться"
 */
function setSidebarSignupButtons() {
  const topBlockContentDiv = document.getElementById('sidebarTopBlockContent');
  topBlockContentDiv.innerHTML = buttonNavComponent({
    href: '',
    data_section: 'loginModal',
    name: 'Логин',
  });
  topBlockContentDiv.innerHTML += buttonNavComponent({
    href: '',
    data_section: 'signupModal',
    name: 'Регистрация',
  });
}

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
      setSidebarUserPreview();
    }));

    this.unsubscribes.push(store.subscribe(authorizationTypes.LOGOUT, () => {
      store.dispatch(mainPageActions.toggleLogin(false, ''));
      setSidebarSignupButtons();
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
      // TODO: заполнить
      topBlockContent = userPreviewComponent({
        name: store.getState().authorization.name,
        url: `/profile`,
        img: store.getState().authorization.avatar,
      });
    }
    this.root = this.view.render(topBlockContent);
    return this.root;
  }

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    super.destroy();
  }
}
