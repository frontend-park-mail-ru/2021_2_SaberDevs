import BaseComponent from '../_basic/baseComponent.js';
import SidebarView from './sidebarView.js';

import userPreviewComponent from './userPreview.pug.js';
import buttonNavComponent from './buttonNav.pug.js';

import store from '../../flux/store.js';
import {mainPageActions} from '../../flux/actions.js';
import {authorizationTypes} from '../../flux/types.js';
import editorActions from '../../flux/actions/editorActions.js';

import categoriesList from '../../common/categoriesList.js';

const displayedDefaultLimit = 6;

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
    const state = store.getState().authorization;

    let topBlockContent = '';
    if (!state.isAuthenticated) {
      topBlockContent += buttonNavComponent({
        data_section: 'loginModal',
        name: 'Логин',
      });
      topBlockContent += buttonNavComponent({
        data_section: 'signupModal',
        name: 'Регистрация',
      });
    } else {
      topBlockContent = userPreviewComponent({
        login: state.login,
        avatarUrl: state.avatarUrl,
      });
    }
    this.root = this.view.render(
        topBlockContent,
        categoriesList,
        displayedDefaultLimit,
    );
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
      data_section: 'loginModal',
      name: 'Логин',
    });
    topBlockContent += buttonNavComponent({
      data_section: 'signupModal',
      name: 'Регистрация',
    });
    this.view.setTopBlockContent(topBlockContent);
  }
}
