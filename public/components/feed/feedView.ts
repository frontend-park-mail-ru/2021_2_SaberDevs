import BaseComponentView from '../_basic/baseComponentView';
import feedComponent from './feed.pug.js';

import {ComposeFunction} from './composeCardStandart';

import {KeyElementsMap, IKeyElementsMap} from '../_basic/baseComponentView';
import {Rate} from '../../common/types';

interface IKeyElementsMapFeed extends IKeyElementsMap {
  previewBox: HTMLDivElement;
  cardsBox: HTMLDivElement;
  loader: HTMLDivElement;
}

export type KeyElementsMapFeed = KeyElementsMap<IKeyElementsMapFeed>;

// TODO: make it strict
export type FeedCard = {
  id: number,
  liked: Rate,
  [key: string]: any,
}

/**
 * @class FeedView
 */
export default class FeedView extends BaseComponentView {
  composeCards: ComposeFunction;
  root: HTMLElement;
  keyElems: KeyElementsMapFeed;

  /**
   * Хранит состояние - текущие загруженные карточки
   * @param {ComposeFunction} composeCards принимает root - HTMLElement, к которому
   * аппендятся карточки и массив данных, по которому строятся шаблоны
   */
  constructor(composeCards: ComposeFunction) {
    super();
    this.composeCards = composeCards;
    this.root = document.createElement('div');
  }

  /**
    * @param {HTMLElement} preview
    * @param {Array<FeedCard>} cards
    * @return {HTMLElement}
    */
  render(cards: FeedCard[], preview: HTMLElement = null): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = <string> feedComponent();
    const feed = <HTMLElement> wrapper.firstElementChild;

    const previewBox = <HTMLDivElement> feed.querySelector('.feed__preview');
    const cardsBox = <HTMLDivElement> feed.querySelector(`.feed__cards`);
    const loader = <HTMLDivElement> feed.querySelector('#feed__loading');
    if (!(previewBox && cardsBox)) {
      console.warn(
        '{Feed} component template contains an error',
      );
      return document.createElement('div');
    }

    this.keyElems = {
      previewBox,
      cardsBox,
      loader,
    };

    if (preview) {
      previewBox.appendChild(preview);
    }
    this.composeCards(cardsBox, cards);

    this.root = feed;
    return feed;
  }

  /**
    * Восстанавливает видимость индикатора загрузки,
    * добавляет карточки вниз ленты
    * @param {Array<FeedCard>} cards
    */
  addCards(cards: FeedCard[]) {
    if (!this.keyElems) {
      console.warn(
        '{Feed} component hasn\'t been rendered yet',
      );
      return;
    }
    this.composeCards(this.keyElems.cardsBox, cards);
    this.showLoadingAnimation();
  }

  /**
    * Стирает содержимое ленты
    */
  clear() {
    if (!this.keyElems) {
      console.warn(
        '{Feed} component hasn\'t been rendered yet',
      );
      return;
    }
    this.keyElems.cardsBox.innerHTML = '';
  }

  /**
   * hide loading component
   */
  hideLoadingAnimation() {
    if (!this.keyElems) {
      console.warn(
        '{Feed} component hasn\'t been rendered yet',
      );
      return;
    }
    this.keyElems.loader.style.display = 'none';
  }

  /**
   * show loading component
   */
  showLoadingAnimation() {
    if (!this.keyElems) {
      console.warn(
        '{Feed} component hasn\'t been rendered yet',
      );
      return;
    }
    this.keyElems.loader.style.display = 'block';
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
