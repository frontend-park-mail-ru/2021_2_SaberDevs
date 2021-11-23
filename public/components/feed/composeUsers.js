import profileCardComponent from '../profileCard/profileCard.pug.js';
import composeCards from './composeCardStandart.js';

import {appendApiImg} from '../../common/utils.js';
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
 * Добавить карточки в root-HTMLElement
 * Нужен как универсальное правило отрисовки карточек
 * в качестве реакции на данные с сервера
 * @param {HTMLElement} root - элемент, куда будут вставлены карточки
 * @param {Array<Card>} cards - Массив карточек
 */
export default function composeUsers(root, cards) {
  if (cards.length === 0) {
    return;
  }
  // данные - это юзер
  if ('login' in cards[0]) {
    cards.forEach((element) => {
      appendApiImg(element);
      const cardWrapper = document.createElement('div');

      cardWrapper.innerHTML = profileCardComponent(element);
      root.appendChild(cardWrapper.firstChild);
    });
  } else {
    // иначе статья
    composeCards(root, cards);
  }
}
