import BaseComponent from '../_basic/baseComponent.js';
import HeaderView from './headerView.js';

/**
 * Раскрытие строки поиска
 * @param {HTMLElement} navItems
 * @param {HTMLElement} searchButton
 * @param {HTMLElement} searchInput
 */
function openSearchField(navItems, searchButton, searchInput) {
  if (searchButton.classList.contains('search__button_search-icon')) {
    console.log('to open');
    navItems.style.pointerEvents = 'none';
    searchButton.classList.remove('search__button_search-icon');
    searchButton.classList.add('search__button_cross-icon');
    searchInput.classList.remove('search__input_close');
    searchInput.classList.add('search__input_open');
  } else if (searchButton.classList.contains('search__button_cross-icon')) {
    console.log('to close');
    navItems.style.pointerEvents = 'all';
    searchButton.classList.add('search__button_search-icon');
    searchButton.classList.remove('search__button_cross-icon');
    searchInput.classList.add('search__input_close');
    searchInput.classList.remove('search__input_open');
  }
}

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
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();

    const searchBtn = this.root.querySelector('.search__button');
    const navItems = this.root.querySelector('.header__nav-items');
    const searchInput = this.root.querySelector('.search__input');

    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearchField(navItems, searchBtn, searchInput);
    });

    return this.root;
  }
}
