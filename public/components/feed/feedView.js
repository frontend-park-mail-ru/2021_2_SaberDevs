import BaseComponentView from '../_basic/baseComponentView.js';
import cardComponent from './card.pug.js';
import feedComponent from './feed.pug.js';

import {redirect} from '../../utils.js';

import store from '../../flux/store.js';
import {profilePageActions} from '../../flux/actions.js';
import readerActions from '../../flux/actions/readerActions.js';

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
 * Добавить карточки в root-HTMLElement, навесить нужные обработчики
 * @param {HTMLElement} root - элемент, куда будут вставлены карточки
 * @param {Array<Card>} cards - Массив карточек
 */
function composeCards(root, cards) {
  // TODO: вынести в MV, карточки получить квериселектороллом
  cards.forEach((element) => {
    const cardWrapper = document.createElement('div');
    cardWrapper.innerHTML = cardComponent(element);
    const cardDiv = cardWrapper.firstChild;

    cardDiv.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTarget = e.currentTarget;
      console.warn(currentTarget.id);
      store.dispatch(readerActions.setArticleLoading(element));
      redirect('/article/' + currentTarget.id);
    });

    cardDiv.querySelector('.card__author-photo').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          store.dispatch(profilePageActions.setUserInfo(element.author));
          redirect('/user/' + e.currentTarget.textContent);
        },
    );

    cardDiv.querySelectorAll('.tags__tag').forEach((t) => t.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.warn('TODO: клик по тегу', e.currentTarget.textContent);
        },
    ));

    root.appendChild(cardDiv);
  });
}

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
    const wrapper = document.createElement('div');
    wrapper.innerHTML = feedComponent({
      preview,
      cards: '',
    });
    const feed = wrapper.firstChild;
    composeCards(feed.querySelector(`.feed__cards`), cards);

    this.root = feed;
    return feed;
  }

  /**
    * @param {Array.Card} cards
    * Восстанавливает видимость индикатора загрузки,
    * добавляет карточки вниз ленты
    */
  addCards(cards) {
    const cardsDiv = this.root.querySelector(`.feed__cards`);
    if (!cardsDiv) {
      console.warn('cannot append cards till Feed is not rendered');
      return;
    }
    composeCards(cardsDiv, cards);
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
}
