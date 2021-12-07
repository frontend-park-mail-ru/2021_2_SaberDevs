import BaseComponent from '../_basic/baseComponent.js';
import HeaderView from './headerView.js';

import store from '../../flux/store.js';
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
    this.isBlur = false;
    this.isOpen = false;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();

    const searchBtn = this.root.querySelector('.search__button');
    const menuBtn = this.root
        .querySelector('.header__search-btn-mobile-hideble');
    const searchInput = this.root.querySelector('.search__input');
    const searchRow = this.root.querySelector('.search__row');
    const groupOptions = this.root.querySelector(
        '.search__row_group_dropdown',
    );

    groupOptions.querySelector('.search__row_group_dropdown-content').childNodes
        .forEach((group) => group.addEventListener(
            'click',
            (e) => {
              groupOptions.querySelector('.search__row_group_bar').value =
                  e.target.textContent;
              store.dispatch(searchActions.setSearchGroup(
                  e.target.dataset.search,
                  e.target.textContent,
              ));
              // восстанавливаем потерянный при клике фокус
              searchInput.focus();
            }),
        );

    groupOptions.addEventListener(
        'mouseover',
        (e) => searchInput.removeEventListener('focusout', focusOutListener),
    );
    groupOptions.addEventListener(
        'mouseout',
        (e) => searchInput.addEventListener('focusout', focusOutListener),
    );

    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.isBlur && !this.isOpen) {
        this.openSearchField();
      }
    });

    searchInput.addEventListener('keydown', ({keyCode, target}) => {
      if (keyCode === 13) {
        store.dispatch(searchActions.setSearchValue(searchInput.value));
        searchInput.blur();
        redirect('/search');
        // явно записываем группу поиска в строку,
        // а то мало ли что там в редьюсере
        // Обязательно селектор т.к. хедер перендерится при переходе
        this.root.querySelector('.search__row_group_bar').value =
            store.getState().search.description;
      }
    });

    const focusOutListener = (e) => {
      console.log('{Header} searchField lost focus');
      this.closeSearchField();
      this.isBlur = true;
      const delay = parseFloat(searchRow.style.transitionDuration) * 1000;
      setTimeout(() => this.isBlur=false, delay);
    };
    searchInput.addEventListener('focusout', focusOutListener);

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
        });
      }
    });

    return this.root;
  }

  /**
   * closeSearchField
   */
  closeSearchField() {
    const searchBtn = this.root.querySelector('.search__button');
    const navItems = this.root.querySelector('.header__nav-items');
    const searchRow = this.root.querySelector('.search__row');
    const addArticleBtn = this.root.querySelector('a.header__add-article-btn');
    console.log('{Header} searchField close');

    addArticleBtn.classList.remove('hide');
    navItems.style.pointerEvents = 'all';
    this.root.querySelector('.header__title-block').style.display = 'flex';
    searchBtn.classList.add('search-icon');
    searchBtn.classList.remove('cross-icon');
    searchRow.classList.add('search__row_close');
    searchRow.classList.remove('search__row_open');
    this.isOpen = false;
  };

  /**
   * openSearchField
   */
  openSearchField() {
    const searchBtn = this.root.querySelector('.search__button');
    const navItems = this.root.querySelector('.header__nav-items');
    const searchRow = this.root.querySelector('.search__row');
    const searchInput = this.root.querySelector('.search__input');
    const addArticleBtn = this.root.querySelector('a.header__add-article-btn');

    console.log('{Header} searchField open');
    addArticleBtn.classList.add('hide');
    navItems.style.pointerEvents = 'none';
    if (MobileLayoutUtils.isDeviceTablet()) {
      this.root.querySelector('.header__title-block').style.display = 'none';
    }
    searchBtn.classList.remove('search-icon');
    searchBtn.classList.add('cross-icon');
    searchRow.classList.remove('search__row_close');
    searchRow.classList.add('search__row_open');
    searchInput.focus();
    searchInput.select();
    this.isOpen = true;
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
