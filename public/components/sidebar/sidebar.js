import BaseComponent from '../_basic/baseComponent.js';
import SidebarView from './sidebarView.js';

import userPreviewComponent from './userPreview.pug.js';
import buttonNavComponent from './buttonNav.pug.js';

import store from '../../flux/store.js';
import {mainPageActions} from '../../flux/actions.js';
import {authorizationTypes, streamTypes} from '../../flux/types.js';

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

    this.unsubscribes.push(
        store.subscribe(authorizationTypes.LOGIN, () => {
          store.dispatch(
              (dispatch, getState) => dispatch(
                  mainPageActions.toggleLogin(true,
                      getState().authorization.login),
              ));
          this.setSidebarUserPreview();
        }),
        store.subscribe(authorizationTypes.LOGOUT, () => {
          store.dispatch(mainPageActions.toggleLogin(false, ''));
          this.setSidebarSignupButtons();
        }));

    this.unsubscribes.push(
        store.subscribe(streamTypes.SAVE_NEW_COMMENTS, (comments) => {
          this.addComments(comments);
        }),
    );
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    const state = store.getState().authorization;

    const comments = [...store.getState().stream.comments].reverse();
    this.root = this.view.render(
        categoriesList,
        displayedDefaultLimit,
        comments,
    );
    if (!state.isAuthenticated) {
      this.setSidebarSignupButtons();
    } else {
      this.setSidebarUserPreview();
    }

    const categoryItems = this.view.root
        .querySelectorAll('.sidebar__categories-item');
    const categoryMore = this.view.root
        .querySelector('.sidebar__categories-more-btn');
    const moreText = this.view.root
        .querySelector('.sidebar__categories-more-text');

    categoriesMore(categoryItems, categoryMore, moreText);

    this.view.root.querySelector('.sidebar__categories-more')
        .addEventListener('click', (e) => {
          e.preventDefault();
          categoriesMore(categoryItems, categoryMore, moreText);
        });

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
      name: 'Войти',
    });
    topBlockContent += buttonNavComponent({
      data_section: 'signupModal',
      name: 'Регистрация',
    });
    this.view.setTopBlockContent(topBlockContent);
    this.root.querySelector('[data-section="loginModal"]').style.width = '100%';
  }

  /**
   * @param {Array<Comment>} comments
   */
  addComments(comments) {
    this.view.addComments(comments);
  }
}

/**
 * Показать больше категорий
 * @param {string} categoryItems
 * @param {string} arrow
 * @param {string} moreBtn
 */
function categoriesMore(categoryItems, arrow, moreBtn) {
  let hide = true;

  if (arrow.classList.contains('rotate-180')) {
    moreBtn.innerText = 'Показать ещё';
    arrow.classList.remove('rotate-180');
    hide = true;
  } else {
    moreBtn.innerText = 'Скрыть';
    arrow.classList.add('rotate-180');
    hide = false;
  }

  for (let i = displayedDefaultLimit; i < categoryItems.length; ++i) {
    if (!hide) {
      categoryItems[i].style.display = 'block';
    } else {
      categoryItems[i].style.display = 'none';
    }
  }
}
