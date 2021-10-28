import BaseComponentView from '../_basic/baseComponentView.js';
import cardComponent from './card.pug.js';
import previewComponent from './preview.pug.js';
import feedComponent from './feed.pug.js';

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
    let content = '';
    cards.forEach((element) => {
      content += cardComponent(element);
    });

    // TODO: preview -динамическая подборка популярых записей
    const preview = previewComponent(loadingCard);

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
    cards.forEach((element) => {
      this.root.querySelector(`.feed__cards`).insertAdjacentHTML(
          'beforeend',
          cardComponent(element),
      );
    });
  }

  /**
   * hide loading component
   */
  hideLoadingAnimation() {
    this.root.querySelector('#feed-loading').style.visibility = 'hidden';
  }
}
