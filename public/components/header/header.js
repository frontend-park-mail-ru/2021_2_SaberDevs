import BaseComponent from '../_basic/baseComponent.js';
import HeaderView from './headerView.js';
import SearchRow from '../searchRow/searchRow.js';


import store from '../../flux/store.js';
import editorActions from '../../flux/actions/editorActions.js';
import {searchTypes} from '../../flux/types.js';
import searchActions from '../../flux/actions/searchActions.js';

import {redirect} from '../../common/utils.js';

import MobileLayoutUtils from '../../common/mobileLayout.js';

/**
 * ViewModel-компонент соответсвующего View
 * @class Header
 */
export default class Header extends BaseComponent {
  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new HeaderView();

    // communication
    this.unsubscribes.push(
        store.subscribe(
            searchTypes.SUBMIT_ON_HEADER,
            () => {
              const state = store.getState().search;
              redirect(`/search?g=${state.group}&q=${state.value}`);
            },
        ),
    );
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();

    const navItems = this.root.querySelector('.header__nav-items');
    const addArticleBtn = this.root.querySelector('a.header__add-article-btn');
    const headerTitle = this.root.querySelector('.header__title-block');

    // устанавливаем поисковую строку
    const sr = new SearchRow(
        searchActions.submitOnHeader,
        true,
        () => {
          addArticleBtn.classList.add('hide');
          navItems.style.pointerEvents = 'none';
          if (MobileLayoutUtils.isDevicePhone()) {
            headerTitle.style.display = 'none';
          }
        },
        () => {
          addArticleBtn.classList.remove('hide');
          navItems.style.pointerEvents = 'all';
          headerTitle.style.display = 'flex';
        },
    );
    sr.mountInPlace(this.root);

    this.root.querySelector('.header__add-article-btn-sign')
        .addEventListener(
            'click',
            () => store.dispatch(editorActions.createArticle()),
        );

    const menuBtn = this.root
        .querySelector('.header__search-btn-mobile-hideble');

    menuBtn?.addEventListener('click', (e) => {
      e.preventDefault();

      const sidebar = document.querySelector('.sidebar');
      const searchBtn = document.querySelector('.search__button');
      const overlay = document.querySelector('.modal__overlay');

      if (!searchBtn.classList.contains('hide')) {
        searchBtn.classList.add('hide');
        e.currentTarget.classList.add('hide');
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';

        sidebar.style.display = 'flex';
        overlay.appendChild(sidebar);

        overlay.addEventListener('click', (e) => {
          e.preventDefault();
          this.hideSidebar();
        });

        const widthMatch = window.matchMedia('(min-width: 900px)');
        widthMatch.addEventListener('change', (e) => {
          e.preventDefault();
          this.hideSidebar();
          // TODO: mobile sidebar
        });
      }
    });

    return this.root;
  }

  /**
   * Прячет сайдбар
   */
  hideSidebar() {
    const searchBtn = this.root.querySelector('.search__button');
    const menuBtnThis = this.root
        .querySelector('.header__search-btn-mobile-hideble');
    const overlay = this.root.querySelector('.modal__overlay');
    const screen = this.root.querySelector('.screen');
    const sidebar = this.root.querySelector('.sidebar');

    searchBtn.classList.remove('hide');
    menuBtnThis.classList.remove('hide');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';

    if (sidebar) {
      screen.appendChild(sidebar);
    }
    overlay.innerHTML = overlay.innerHTML;
  }
};
