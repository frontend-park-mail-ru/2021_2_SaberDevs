import BaseComponentView from '../_basic/baseComponentView.js';
import cardComponent from './card.pug.js';
import feedComponent from './feed.pug.js';

import {redirect} from '../../utils.js';

import store from '../../flux/store.js';
import {profilePageActions} from '../../flux/actions.js';

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
    // TODO: add event listeners here
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
    * Восстанавливает видимость индикатора загрузки,
    * добавляет карточки вниз ленты
    */
  addCards(cards) {
    const cardsDiv = this.root.querySelector(`.feed__cards`);
    if (!cardsDiv) {
      console.warn('cannot append cards till Feed is not rendered');
      return;
    }
    // TODO: вынести в MV, карточки получить квериселектороллом
    cards.forEach((element) => {
      const cardWrapper = document.createElement('div');
      cardWrapper.innerHTML = cardComponent(element);
      const cardDiv = cardWrapper.firstChild;

      cardDiv.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTarget = e.currentTarget;
        console.warn(currentTarget.id);
      });

      cardDiv.querySelector('.author-time__author-name').addEventListener(
          'click',
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.warn('клик по автору', e.currentTarget.textContent);
            store.dispatch(profilePageActions.setUserLoading({
              login: e.currentTarget.textContent,
            }));
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

      cardsDiv.appendChild(cardDiv);
    });
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
