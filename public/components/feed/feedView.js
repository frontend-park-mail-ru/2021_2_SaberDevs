import BaseComponentView from '../_basic/baseComponentView.js';
import cardComponent from './card.pug.js';
import feedComponent from './feed.pug.js';

/**
 * Описание сущности карточки в новостной ленте
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
 * @class FeedView
 */
export default class FeedView extends BaseComponentView {
  /**
   * Хранит состояние - текущие загруженные карточки
   * @param {string} preview
   * @param {Array.Card} cards массив карточек (может быть пустым)
   */
  constructor(preview, cards) {
    super();
    this.root = this.render(preview, cards);
  }

  /**
    * @param {string} preview
    * @param {Array.Card} cards
    * @return {HTMLElement}
    */
  render(preview, cards) {
    let content = '';
    cards.forEach((element) => {
      content += cardComponent(element);
    });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = feedComponent({
      preview,
      cards: content,
    });
    this.root = wrapper.firstChild;
    return wrapper.firstChild;
  }

  /**
    * @param {Array.Card} cards
    */
  addCards(cards) {
    const cardsDiv = this.root.querySelector(`.feed__cards`);
    if (!cardsDiv) {
      console.warn('cannot append cards till Feed is not rendered');
      return;
    }
    cards.forEach((element) => {
      cardsDiv.insertAdjacentHTML(
          'beforeend',
          cardComponent(element),
      );
    });
  }

  /**
    * @param {Array.Card} cards
    */
  refreshCards(cards) {
    const cardsDiv = this.root.querySelector(`.feed__cards`);
    cardsDiv.innerHTML = '';
    cards.forEach((element) => {
      cardsDiv.insertAdjacentHTML(
          'beforeend',
          cardComponent(element),
      );
    });
  }

  /**
   * hide loading component
   */
  hideLoadingAnimation() {
    this.root.querySelector('#feed__loading').style.visibility = 'hidden';
  }
}
