import cardComponent from './card.pug.js';
import {genRanHexColor} from '../../common/utils.js';
import {appendApiImg} from '../../common/transformApi.js';

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
export default function composeCards(root, cards) {
  cards.forEach((element) => {
    appendApiImg(element);
    appendApiImg(element.author);
    const cardWrapper = document.createElement('div');
    const tags = Array.isArray(element.tags) ? element.tags.map((tag) => ({
      content: tag,
      color: genRanHexColor(tag),
    })) : [];
    const category = {
      categoryContent: element.category,
      categoryColor: genRanHexColor(element.category),
    };
    cardWrapper.innerHTML = cardComponent({
      ...element,
      tags,
      category,
    });
    root.appendChild(cardWrapper.firstChild);
  });
}
