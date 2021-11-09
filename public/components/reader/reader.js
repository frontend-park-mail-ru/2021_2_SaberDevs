import BaseComponent from '../_basic/baseComponent.js';
import ReaderView from './readerView.js';

import store from '../../flux/store.js';
import {readerTypes} from '../../flux/types.js';

/**
 * Компонент для чтения статей
 * @class Reader
 */
export default class Reader extends BaseComponent {
  /**
   * Окошко сообщений о состоянии сервиса
   */
  constructor() {
    super();
    this.view = new ReaderView();

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    this.unsubscribes.push(
        store.subscribe(readerTypes.OPEN_ARTICLE, () => {
          console.warn('subscribe: reader OPEN_ARTICLE');
          const state = store.getState().reader;
          this.openArticle(state[state.currentId]);
        }),
    );
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();

    const state = store.getState().reader;
    this.root = this.view.render(state[state.currentId]);
    return this.root;
  }

  /**
    * Задать содержание статьи
    * @param {Object} article
    * @property {string} title
    * @property {string} text
    * @property {Array<string>} tags
    * @property {string} datetime
    * @property {Object} author
    * @property {number} likes
    * @property {number} comments
    */
  openArticle(article) {
    this.root.innerHTML = '';
    this.view.render(article).childNodes.forEach((node) => {
      this.root.appendChild(node.cloneNode(true));
    });
  }
}
