import BaseComponent from '../_basic/baseComponent';
import SearchRowView from './searchRowView';

import store from '../../flux/store';
import searchActions from '../../flux/actions/searchActions';

import {KeyElementsMapSearchRow} from './SearchRowView';

/**
 * @class SearchRow
 */
export default class SearchRow extends BaseComponent {
  view: SearchRowView;
  isBlur: boolean;
  isOpen: boolean;
  closeOnBlur: boolean;
  onOpen: () => void;
  onClose: () => void;
  submit: () => void;

  /**
   * @param {Function} submit функция выпуска Action при сабмите поиска
   * @param {boolean? = false} closeOnBlur true, чтобы поисковая строка скрывалась
   * @param {function?} onOpen дополнительные действия при открытии
   * @param {function?} onClose дополнительные действия при закрытии
   * Функции вызываются ДО изменения стиля поисковой строки
   */
  constructor(
      submit: () => void,
      closeOnBlur: boolean = false,
      onOpen: () => void = () => {},
      onClose: () => void = () => {},
  ) {
    super();
    this.view = new SearchRowView();
    this.isBlur = false;
    this.isOpen = false;
    this.closeOnBlur = closeOnBlur;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.submit = submit;
  }

  get keyElems(): KeyElementsMapSearchRow {
    return this.view.keyElems;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();
  
    this.root = this.view.render(!this.closeOnBlur, !this.closeOnBlur);
    if (!this.keyElems) {
      return this.root;
    }
    this.keyElems.groupDropDown.childNodes
        .forEach((group) => group.addEventListener(
          'click',
          (e: Event) => {
            const target = <HTMLDivElement> e.target;
            this.keyElems.groupBar.value = target.textContent;
            store.dispatch(searchActions.setSearchGroup(
              target.dataset.search,
              target.textContent,
            ));
            // восстанавливаем потерянный при клике фокус
            this.keyElems.searchInput.focus();
          }),
        );

    if (this.closeOnBlur) {
      this.keyElems.groupOptions.addEventListener(
        'mouseover',
        (e: Event) => this.keyElems.searchInput.removeEventListener('focusout', focusOutListener),
      );
      this.keyElems.groupOptions.addEventListener(
        'mouseout',
        (e: Event) => this.keyElems.searchInput.addEventListener('focusout', focusOutListener),
      );
    }

    this.keyElems.searchBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      if (this.closeOnBlur) {
        if (!this.isBlur && !this.isOpen) {
          this.openSearchField();
        }
      } else {
        const value: string = this.keyElems.searchInput.value.trim();
        if (value === '') {
          return;
        }
        store.dispatch(searchActions.setSearchValue(value));
        store.dispatch(this.submit());
      }
    });

    this.keyElems.searchInput.addEventListener('key', ({key}: KeyboardEvent) => {
      if (key === 'Enter') {
        const value: string = this.keyElems.searchInput.value.trim();
        // любое нажатие ентер в закрывающимся режиме=переход на страницу поиска
        if (!this.closeOnBlur && value === '') {
          return;
        }
        store.dispatch(searchActions.setSearchValue(value));
        store.dispatch(this.submit());
        this.keyElems.searchInput.blur();
        // явно записываем группу поиска в строку,
        // а то мало ли что там в редьюсере
        // Обязательно селектор т.к. хедер перендерится при переходе
        this.keyElems.groupBar.value = store.getState().search.description;
      }
    });

    const focusOutListener = (e: FocusEvent) => {
      console.log('{SearchRow} searchField lost focus');
      this.closeSearchField();
      this.isBlur = true;
      const delay = parseFloat(this.keyElems.searchRow.style.transitionDuration) * 1000;
      setTimeout(() => this.isBlur = false, delay);
    };
    if (this.closeOnBlur) {
      this.keyElems.searchInput.addEventListener('focusout', focusOutListener);
    }

    return this.root;
  }

  /**
   * closeSearchField
   */
  closeSearchField() {
    console.log('{SearchRow} searchField close');
    if (this.keyElems === null) {
      console.warn('{SearchRow} component hasn\'t been rendered yet');
      return;
    }

    this.onClose();
    this.keyElems.searchBtn.classList.add('search-icon');
    this.keyElems.searchBtn.classList.remove('cross-icon');
    this.keyElems.searchRow.classList.add('search__row_close');
    this.keyElems.searchRow.classList.remove('search__row_open');
    this.isOpen = false;
  };

  /**
   * openSearchField
   */
  openSearchField() {
    console.log('{SearchRow} searchField open');
    if (this.keyElems === null) {
      console.warn('{SearchRow} component hasn\'t been rendered yet');
      return;
    }

    this.onOpen();

    this.keyElems.searchBtn.classList.remove('search-icon');
    this.keyElems.searchBtn.classList.add('cross-icon');
    this.keyElems.searchRow.classList.remove('search__row_close');
    this.keyElems.searchRow.classList.add('search__row_open');
    this.keyElems.searchInput.focus();
    this.keyElems.searchInput.select();
    this.isOpen = true;
  }

  /**
   * заменяет диваk с data-inplace = "place-for-search"
   * на компонент поисковой строки
   * @param {HTMLElement} root
   */
  mountInPlace(root: HTMLElement) {
    const replaced = <HTMLDivElement> root
        .querySelector('div[data-inplace="place-for-search"]');
    if (!replaced) {
      console.warn(`{SearchRow} no place prepared for SearchRow component
      // div[data-inplace="place-for-search"] // is requried`);
      return;
    }
    replaced.parentElement.replaceChild(this.render(), replaced);
  }
}
