import profileCardComponent from '../profileCard/profileCard.pug.js';
import composeCards from './composeCardStandart';

import {appendApiImg} from '../../common/transformApi.js';

import {User} from '../../common/types';
import {Article} from '../../common/types';
import {ComposeFunction} from './composeCardStandart';

/**
 * Добавить карточки в root-HTMLElement
 * Нужен как универсальное правило отрисовки карточек
 * в качестве реакции на данные с сервера
 * @param {HTMLElement} root - элемент, куда будут вставлены карточки
 * @param {Array<User>} cards - Массив карточек
 */
export default <ComposeFunction> function composeUsers(root: HTMLElement, cards: User[] | Article[]) {
  if (cards.length === 0) {
    return;
  }
  // данные - это юзер
  if ('login' in cards[0]) {
    cards.forEach((element) => {
      appendApiImg(element);
      const cardWrapper = document.createElement('div');

      cardWrapper.innerHTML = <string> profileCardComponent({
        ...element,
        disableArticles: true,
      });
      root.appendChild(cardwrapper.firstElementChild);
    });
  } else {
    // иначе статья
    composeCards(root, cards);
  }
}
