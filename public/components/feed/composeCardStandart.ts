import cardComponent from './card.pug.js';
import {genRanHexColor} from '../../common/utils.js';
import {appendApiImg} from '../../common/transformApi.js';

import {Article} from '../../common/types';

export type ComposeFunction = (root: HTMLElement, cards: any[]) => void;


/**
 * Добавить карточки в root-HTMLElement
 * Нужен как универсальное правило отрисовки карточек
 * в качестве реакции на данные с сервера
 * @param {HTMLElement} root - элемент, куда будут вставлены карточки
 * @param {Array<Card>} cards - Массив карточек
 */
export default <ComposeFunction> function composeCards(root: HTMLElement, cards: Article[]) {
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
    cardWrapper.innerHTML = <string> cardComponent({
      ...element,
      tags,
      category,
    });
    root.appendChild(cardwrapper.firstElementChild);
  });
}
