import BaseComponent from './baseComponent.js';
import FeedView from './feedView.js';

import store from '../flux/store.js';
import {mainPageActions} from '../flux/actions.js';
import {mainPageTypes} from '../flux/types.js';
/**
 * @typedef {Object} Card
 * @property {string} id           - ID записи
 * @property {string} previewUrl   - ссылка не главную картинку
 * @property {string} title        - заголовок
 * @property {string} text         - содержание записи
 * @property {string} authorUrl    - ссылка на страницу автора
 * @property {string} authorName   - имя автора
 * @property {string} authorAvatar - ссылка на аватар автора
 * @property {string} commentsUrl  - ссылка на комменарии к записи
 * @property {number} comments     - число комментариев к записи
 * @property {number} likes        - рейтинг записи
 * @property {Array.string} tags   - отмеченные автором темы сообщений
 * @return {HTMLElement}
 */

/**
 * ViewModel-компонент соответсвующего View
 * @class Feed
 */
export default class Feed extends BaseComponent {
  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new FeedView();

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    // this.unsubscribes.push(store.subscribe(mainPageTypes.SAVE_NEW_CARDS, () => {
    //   this.view.addCards();
    // }));
  }

  /**
  * @param {Array.Card} cards
  * @return {HTMLElement}
  */
  render(cards) {
    super.render();

    this.root = this.view.render(cards);
    return this.root;
  }

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    super.destroy();
  }
}
