import BaseComponent from '../_basic/baseComponent.js';
import FeedView from './feedView.js';

import store from '../../flux/store.js';

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
   * Универсальный компонент ленты
   * @param {string} storeName - имя редьюсера
   * @param {Type} SAVE_NEW_CARDS_ACTION - событие, на которое
   * в ленту добавляются карточки
   * @param {Action} forbidCardsUploading - действие, которое
   * говорит, о том, что все данные загружены
   * @param {Action} allowCardsUploading - действие, которое
   * разрешает загрузку карточек снова через resetDoNotUploadTime
   * @param {boolean} isAddCards true если карточки добавляются к
   * существующим | false, если заменяют
   * @param {BaseComponent} previewComponent - компонент,
   * который будет вложен в .feed__preview в ленте
   */
  constructor(
      storeName,
      SAVE_NEW_CARDS_ACTION,
      forbidCardsUploading,
      allowCardsUploading,
      isAddCards,
      previewComponent = new BaseComponent(),
  ) {
    console.log('{FEED} creation with params:');
    console.log({storeName});
    console.log({SAVE_NEW_CARDS_ACTION});
    console.log({forbidCardsUploading});
    console.log({allowCardsUploading});
    console.log({previewComponent});
    super();
    this.innerComponent = previewComponent;
    this.storeName = storeName;
    const cards = store.getState()[storeName].cards;
    this.view = new FeedView(previewComponent.render().outerHTML, cards);

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    this.unsubscribes.push(
        store.subscribe(SAVE_NEW_CARDS_ACTION, ({idLastLoaded, cards})=>{
          if (Array.isArray(cards)) {
            if (isAddCards) {
              this.view.addCards(cards);
            } else {
              this.view.refreshCards(cards);
            }

            if (cards[cards.length - 1]?.id === endOfFeedMarkerID) {
              this.view.hideLoadingAnimation();

              if (ajaxDebug) {
                console.log('\'end\' found. doNotUpload flag is set to true');
              }
              // запрещаем загрузку карточек, чтобы не спамить сервер
              store.dispatch(forbidCardsUploading());
              // асинхронное событие (выполняется с помощью преобразователя)
              // разрешает загрузку карточек спустя некоторое время
              store.dispatch((dispatch) => {
                setTimeout(() => {
                  if (ajaxDebug) {
                    console.log('doNotUpload flag is reset to false');
                  }
                  dispatch(allowCardsUploading());
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
  * @return {HTMLElement}
  */
  render() {
    super.render();

    const preview = this.innerComponent.render().outerHTML;
    const cards = store.getState()[this.storeName].cards;
    this.root = this.view.render(preview, cards);

    if (store.getState()[this.storeName].doNotUpload) {
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
