import BaseComponent from '../_basic/baseComponent.js';
import HeaderView from './headerView.js';

import store from '../../flux/store.js';
import searchActions from '../../flux/actions/searchActions.js';

import {redirect} from '../../common/utils.js';
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

    return this.root;
  }

  /**
   * closeSearchField
   */
  closeSearchField() {
    const searchBtn = this.root.querySelector('.search__button');
    const navItems = this.root.querySelector('.header__nav-items');
    const searchRow = this.root.querySelector('.search__row');
    console.log('{Header} searchField close');
    navItems.style.pointerEvents = 'all';
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
    console.log('{Header} searchField open');
    navItems.style.pointerEvents = 'none';
    searchBtn.classList.remove('search-icon');
    searchBtn.classList.add('cross-icon');
    searchRow.classList.remove('search__row_close');
    searchRow.classList.add('search__row_open');
    searchInput.focus();
    searchInput.select();
    this.isOpen = true;
  };
}
