import BaseComponentView from './baseComponentView.js';
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
 * @class CardView
 */
export default class CardView extends BaseComponentView {
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
    return contentDiv;
  }
}
