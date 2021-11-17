import BaseComponent from '../_basic/baseComponent.js';
import HeaderView from './headerView.js';

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

    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.isBlur && !this.isOpen) {
        this.openSearchField();
      }
    });

    searchInput.addEventListener('keydown', ({keyCode, target}) => {
      if (keyCode === 13) {
        console.log('{Header} searchField enter (идем искать)', target.value);
        this.closeSearchField();
        setTimeout(() => console.log('{Header} searchField вот тут редирект'));
      }
    });

    searchInput.addEventListener('focusout', (e) => {
      console.log('{Header} searchField lost focus');
      this.closeSearchField();
      this.isBlur = true;
      const delay = parseFloat(searchInput.style.transitionDuration) * 1000;
      setTimeout(() => this.isBlur=false, delay);
    });

    return this.root;
  }

  /**
   * closeSearchField
   */
  closeSearchField() {
    const searchBtn = this.root.querySelector('.search__button');
    const navItems = this.root.querySelector('.header__nav-items');
    const searchInput = this.root.querySelector('.search__input');
    console.log('{Header} searchField close');
    navItems.style.pointerEvents = 'all';
    searchBtn.classList.add('search-icon');
    searchBtn.classList.remove('cross-icon');
    searchInput.classList.add('search__input_close');
    searchInput.classList.remove('search__input_open');
    this.isOpen = false;
  };

  /**
   * openSearchField
   */
  openSearchField() {
    const searchBtn = this.root.querySelector('.search__button');
    const navItems = this.root.querySelector('.header__nav-items');
    const searchInput = this.root.querySelector('.search__input');
    console.log('{Header} searchField open');
    navItems.style.pointerEvents = 'none';
    searchBtn.classList.remove('search-icon');
    searchBtn.classList.add('cross-icon');
    searchInput.classList.remove('search__input_close');
    searchInput.classList.add('search__input_open');
    searchInput.focus();
    searchInput.select();
    this.isOpen = true;
  };
}
