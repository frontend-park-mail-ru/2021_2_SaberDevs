import BaseComponent from '../_basic/baseComponent.js';
import FeedView from './feedView.js';

import store from '../../flux/store.js';
import {mainPageActions} from '../../flux/actions.js';
import {mainPageTypes} from '../../flux/types.js';

/**
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

const endOfFeedMarkerID = 'end';
const resetDoNotUploadTime = 60000;  // anti- brutforce

/**
 * ViewModel-компонент соответсвующего View
 * @class Feed
 */
export default class Feed extends BaseComponent {
  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    const cards = store.getState().mainPage.cards;
    this.view = new FeedView(cards);

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    this.unsubscribes.push(
        store.subscribe(mainPageTypes.SAVE_NEW_CARDS, ({idLastLoaded, cards})=>{
          if (Array.isArray(cards)) {
            this.view.addCards(cards);

            if (cards[cards.length - 1]?.id === endOfFeedMarkerID) {
              this.view.hideLoadingAnimation();

              if (ajaxDebug) {
                console.log('\'end\' found. doNotUpload flag is set to true');
              }
              // запрещаем загрузку карточек, чтобы не спамить сервер
              store.dispatch(mainPageActions.forbidCardsLoading());
              // асинхронное событие (выполняется с помощью преобразователя)
              // разрешает загрузку карточек спустя некоторое время
              store.dispatch((dispatch) => {
                setTimeout(() => {
                  if (ajaxDebug) {
                    console.log('doNotUpload flag is reset to false');
                  }
                  dispatch(mainPageActions.allowCardsLoading());
                }, resetDoNotUploadTime);
              });
            }
          } else {
            if (ajaxDebug) {
              console.error('API ERROR! Server must return array of Cards');
            }
          }
        }),
    );
  }

  /**
  * @param {Array.Card} cards
  * @return {HTMLElement}
  */
  render() {
    super.render();

    const cards = store.getState().mainPage.cards;
    this.root = this.view.render(cards);

    if (store.getState().mainPage.doNotUpload) {
      this.view.hideLoadingAnimation();
    }
    return this.root;
  }

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    super.destroy();
  }
}
