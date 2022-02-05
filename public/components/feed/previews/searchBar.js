import BaseComponent from '../../_basic/baseComponent.js';
import SearchBarView from './searchBarView.js';
import SearchRow from '../../searchRow/searchRow.js';

import searchActions from '../../../flux/actions/searchActions';

/**
 * @class SearchBar
 */
export default class SearchBar extends BaseComponent {
  /**
   * Окошко сообщений о состоянии сервиса
   */
  constructor() {
    super();
    this.view = new SearchBarView();
    this.notFound = false;
  }


  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    this.notFound = false;
    super.render();
    this.root = this.view.render();

    // устанавливаем поисковую строку
    const sr = new SearchRow(
        searchActions.submit,
    );
    sr.mountInPlace(this.root);

    return this.root;
  }

  /**
   * рисуем сообщение о том, что записей нет
   * @param {string | HTMLString} title
   * @param {string | HTMLString} text
   */
  showMessage(title, text) {
    if (this.notFound) {
      return;
    }

    const messageDiv = this.root.querySelector('.search-page__message');
    messageDiv.innerHTML = `
      <div class="search-page__message-title">
        ${title}
      </div>
      <div class="search-page__message-text">
        ${text}
      </div>
    `;
    messageDiv.style.display = 'flex';

    this.notFound = true;
  }

  /**
   * рисуем сообщение о том, что записей нет
   */
  clearMessage() {
    const messageDiv = this.root.querySelector('.search-page__message');
    messageDiv.style.display = 'none';

    this.notFound = false;
  }
}
