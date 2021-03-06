import BaseComponentView from '../_basic/baseComponentView.js';
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
   * @param {function} composeCards принимает root - HTMLElement, к которому
   * аппендятся карточки и массив данных, по которому строятся шаблоны
   * @param {string} preview
   * @param {Array.Card} cards массив карточек (может быть пустым)
   */
  constructor(composeCards, preview, cards) {
    super();
    this.composeCards = composeCards;
    this.root = this.render(preview, cards);
  }

  /**
    * @param {string} preview
    * @param {Array.Card} cards
    * @return {HTMLElement}
    */
  render(preview, cards) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = feedComponent({
      preview,
    });
    const feed = wrapper.firstChild;
    this.composeCards(feed.querySelector(`.feed__cards`), cards);

    this.root = feed;
    return feed;
  }

  /**
    * Восстанавливает видимость индикатора загрузки,
    * добавляет карточки вниз ленты
    * @param {Array.Card} cards
    */
  addCards(cards) {
    const cardsDiv = this.root.querySelector(`.feed__cards`);
    if (!cardsDiv) {
      console.warn('cannot append cards till Feed is not rendered');
      return;
    }
    this.composeCards(cardsDiv, cards);
    this.showLoadingAnimation();
  }

  /**
    * Стирает содержимое ленты
    */
  clear() {
    const cardsDiv = this.root.querySelector(`.feed__cards`);
    cardsDiv.innerHTML = '';
  }

  /**
   * hide loading component
   */
  hideLoadingAnimation() {
    this.root.querySelector('#feed__loading').style.display = 'none';
  }

  /**
   * show loading component
   */
  showLoadingAnimation() {
    this.root.querySelector('#feed__loading').style.display = 'block';
  }

  /**
   * стереть отметки о лайках
   */
  clearLikes() {
    this.root.querySelectorAll('.action-btns__liked').forEach((el) => {
      el.classList.remove('.action-btns__liked');
    });
  }
}
