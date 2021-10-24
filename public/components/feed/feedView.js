import BaseComponentView from '../_basic/baseComponentView.js';
import cardComponent from './card.pug.js';

const loadingCard = {
  id: 'loading-card',
  previewUrl: 'static/img/loader-1-HorizontalBalls.gif',
  tags: [],
  title: 'Загрузка...',
  text: `Еще чуть-чуть...`,
  authorUrl: '',
  authorName: 'loading',
  authorAvatar: '',
  commentsUrl: '',
};

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
   * @param {Array.Card} cards массив карточек (может быть пустым)
   */
  constructor(cards) {
    super();
    this.root = this.render(cards);
  }

  /**
    * @param {Array.Card} cards
    * @return {HTMLElement}
    */
  render(cards) {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content col';
    contentDiv.id = 'menu-content-block';

    cards.forEach((element) => {
      contentDiv.innerHTML += cardComponent(element);
    });

    contentDiv.innerHTML += cardComponent(loadingCard);
    this.root = contentDiv;
    return contentDiv;
  }

  /**
    * @param {HTMLElement} trackedCard
    * @param {Array.Card} cards
    */
  addCards(trackedCard, cards) {
    if (!trackedCard) {
      return;
    }
    cards.forEach((element) => {
      trackedCard.insertAdjacentHTML(
          'beforebegin',
          cardComponent(element),
      );
    });
  }
}