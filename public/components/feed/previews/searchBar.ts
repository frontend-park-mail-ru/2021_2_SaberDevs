import BaseComponent from '../../_basic/baseComponent';
import SearchBarView from './searchBarView';
import SearchRow from '../../searchRow/searchRow';

import searchActions from '../../../flux/actions/searchActions';

import {KeyElementsMapSearchBar} from './SearchBarView';

/**
 * @class SearchBar
 */
export default class SearchBar extends BaseComponent {
  notFound: boolean;
  view: SearchBarView;

  /**
   * Окошко сообщений о состоянии сервиса
   */
  constructor() {
    super();
    this.view = new SearchBarView();
    this.notFound = false;
  }

  get keyElems(): KeyElementsMapSearchBar {
    return this.view.keyElems;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    this.notFound = false;
    super.render();
    this.root = this.view.render();
    if (!this.keyElems) {
      return this.root;
    }

    // устанавливаем поисковую строку
    const sr = new SearchRow(
      searchActions.submit,
    );
    sr.mountInPlace(this.root);
    
    return this.root;
  }

  /**
   * рисуем сообщение о том, что записей нет
   * @param {string} title
   * @param {string} text
   */
  showMessage(title: string, text: string) {
    if (!this.keyElems) {
      console.warn(
        '{SearchBar} component hasn\'t been rendered yet',
      );
      return;
    }
    if (this.notFound) {
      return;
    }

    this.keyElems.messageDiv.innerHTML = `
      <div class="search-page__message-title">
        ${title}
      </div>
      <div class="search-page__message-text">
        ${text}
      </div>
    `;
    this.keyElems.messageDiv.style.display = 'flex';

    this.notFound = true;
  }

  /**
   * рисуем сообщение о том, что записей нет
   */
  clearMessage() {
    if (!this.keyElems) {
      console.warn(
        '{SearchBar} component hasn\'t been rendered yet',
      );
      return;
    }
    this.keyElems.messageDiv.style.display = 'none';
    this.notFound = false;
  }
}
