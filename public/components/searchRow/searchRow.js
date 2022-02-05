import BaseComponent from '../_basic/baseComponent.js';
import SearchRowView from './searchRowView.js';

import store from '../../flux/store';
import searchActions from '../../flux/actions/searchActions';

/**
 * @class SearchRow
 */
export default class SearchRow extends BaseComponent {
  /**
   * @param {function} submit функция выпуска Action при сабмите поиска
   * @param {boolean?} closeOnBlur true, чтобы поисковая строка скрывалась
   * @param {function?} onOpen дополнительные действия при открытии
   * @param {function?} onClose дополнительные действия при закрытии
   * Функции вызываются ДО изменения стиля поисковой строки
   */
  constructor(
      submit,
      closeOnBlur = false,
      onOpen = () => {},
      onClose = () => {},
  ) {
    super();
    this.view = new SearchRowView();
    this.isBlur = false;
    this.isOpen = false;
    this.closeOnBlur = closeOnBlur;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.components = null;
    this.submit = submit;
  }


  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render(!this.closeOnBlur, !this.closeOnBlur);

    const searchBtn = this.root.querySelector('.search__button');
    const searchInput = this.root.querySelector('.search__input');
    const searchRow = this.root.querySelector('.search__row');
    const groupOptions = this.root.querySelector(
        '.search__row_group_dropdown',
    );

    this.components = {
      searchBtn,
      searchInput,
      searchRow,
      groupOptions,
    };

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

    if (this.closeOnBlur) {
      groupOptions.addEventListener(
          'mouseover',
          (e) => searchInput.removeEventListener('focusout', focusOutListener),
      );
      groupOptions.addEventListener(
          'mouseout',
          (e) => searchInput.addEventListener('focusout', focusOutListener),
      );
    }

    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.closeOnBlur) {
        if (!this.isBlur && !this.isOpen) {
          this.openSearchField();
        }
      } else {
        const value = searchInput.value.trim();
        if (value === '') {
          return;
        }
        store.dispatch(searchActions.setSearchValue(value));
        store.dispatch(this.submit());
      }
    });

    searchInput.addEventListener('keydown', ({keyCode, target}) => {
      if (keyCode === 13) {
        const value = searchInput.value.trim();
        // любое нажатие ентер в закрывающимся режиме=переход на страницу поиска
        if (!this.closeOnBlur && value === '') {
          return;
        }
        store.dispatch(searchActions.setSearchValue(value));
        store.dispatch(this.submit());
        searchInput.blur();
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
    if (this.closeOnBlur) {
      searchInput.addEventListener('focusout', focusOutListener);
    }

    return this.root;
  }

  /**
   * closeSearchField
   */
  closeSearchField() {
    console.log('{Header} searchField close');
    if (this.components === null) {
      console.warn('{Header} component hasn\'t been rendered yet');
      return;
    }

    this.onClose();
    this.components.searchBtn.classList.add('search-icon');
    this.components.searchBtn.classList.remove('cross-icon');
    this.components.searchRow.classList.add('search__row_close');
    this.components.searchRow.classList.remove('search__row_open');
    this.isOpen = false;
  };

  /**
   * openSearchField
   */
  openSearchField() {
    console.log('{Header} searchField open');
    if (this.components === null) {
      console.warn('{Header} component hasn\'t been rendered yet');
      return;
    }

    this.onOpen();

    this.components.searchBtn.classList.remove('search-icon');
    this.components.searchBtn.classList.add('cross-icon');
    this.components.searchRow.classList.remove('search__row_close');
    this.components.searchRow.classList.add('search__row_open');
    this.components.searchInput.focus();
    this.components.searchInput.select();
    this.isOpen = true;
  }

  /**
   * заменяет диваk с data-inplace = "place-for-search"
   * на компонент поисковой строки
   * @param {HTMLElement} root
   */
  mountInPlace(root) {
    const replaced = root
        .querySelector('[data-inplace="place-for-search"]');
    replaced?.parentElement.replaceChild(this.render(), replaced);
  }
}
