import BaseComponent from '../_basic/baseComponent';
import SidebarView from './sidebarView';

import userPreviewComponent from './userPreview.pug.js';
import buttonNavComponent from './buttonNav.pug.js';

import store from '../../flux/store';
import {AuthorizationTypes, StreamTypes} from '../../flux/types';

import categoriesList from '../../common/categoriesList';
import {AuthorizationStateObject} from '../../flux/reducers/authorizeReducer';
import {Comment} from '../../common/types';

const displayedDefaultLimit = 6;

/**
 * Показать больше категорий
 * @param {NodeListOf<HTMLElement>} categories
 * @param {HTMLElement} arrow
 * @param {HTMLElement} moreBtn
 */
 function showMoreCategories(categories: NodeListOf<HTMLElement>, arrow: HTMLElement, moreBtn: HTMLElement) {
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

  for (let i = displayedDefaultLimit; i < categories.length; ++i) {
    if (!hide) {
      categories[i].style.display = 'block';
    } else {
      categories[i].style.display = 'none';
    }
  }
}

/**
 * ViewModel-компонент соответсвующего View
 * @class Sidebar
 */
export default class Sidebar extends BaseComponent {
  view: SidebarView;

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
      store.subscribe(AuthorizationTypes.LOGIN, () => {
        console.log('{Sidebar} Login reaction');
        this.setSidebarUserPreview();
      }),
      store.subscribe(AuthorizationTypes.LOGOUT, () => {
        console.log('{Sidebar} Logout reaction');
        this.setSidebarSignupButtons();
      }));

    this.unsubscribes.push(
      store.subscribe(
        StreamTypes.SAVE_NEW_COMMENTS,
        (comments) => this.addComments(comments),
      ),
    );
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();

    const state: AuthorizationStateObject = store.getState().authorization;

    const comments: Comment[] = [...store.getState().stream.comments].reverse();
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

    const categoryItems = <NodeListOf<HTMLElement>> this.view.root
      .querySelectorAll('.sidebar__categories-item');
    const categoryMore = <HTMLElement> this.view.root
      .querySelector('.sidebar__categories-more-btn');
    const moreText = <HTMLElement> this.view.root
      .querySelector('.sidebar__categories-more-text');

    //TODO: check
    // showMoreCategories(categoryItems, categoryMore, moreText);

    this.view.root.querySelector('.sidebar__categories-more')
      .addEventListener('click', (e: Event) => {
        e.preventDefault();
        showMoreCategories(categoryItems, categoryMore, moreText);
      });

    return this.root;
  }

  /**
   * Заполнить верхний блок сайдбара именем и
   * аватаркой пользователя, кнопкой "новая запись"
   */
  setSidebarUserPreview() {
    const state: AuthorizationStateObject = store.getState().authorization;
    this.view.setTopBlockContent(userPreviewComponent(state));
  }

  /**
   * Заполнить верхний блок сайдбара кнопками "войти / зарегистрироваться"
   */
  setSidebarSignupButtons() {
    let topBlockContent = <string> buttonNavComponent({
      data_section: 'loginModal',
      name: 'Войти',
    });
    topBlockContent += <string> buttonNavComponent({
      data_section: 'signupModal',
      name: 'Регистрация',
    });
    this.view.setTopBlockContent(topBlockContent);
    (<HTMLElement>this.root.querySelector('[data-section="loginModal"]')).style.width = '100%';
  }

  /**
   * @param {Array<Comment>} comments
   */
  addComments(comments: Comment[]) {
    this.view.addComments(comments);
  }
}

