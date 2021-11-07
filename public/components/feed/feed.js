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

const resetDoNotUploadTime = 6000;  // anti- brutforce

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
   * @param {Type} CLEAR_CARDS_ACTION - событие, на которое
   * лента стирается
   * @param {Type} FORBID_CARDS_UPLOADING_ACTION - событие, на которое
   * лента скрывает анимацию подгрузки. Предполаается,
   * что такое событие генерируется методом forbidCardsUploading
   * @param {Type} ALLOW_CARDS_UPLOADING_ACTION - событие, на которое
   * лента приготавливаается к загрузке новых записей. Предполаается,
   * что такое событие генерируется методом allowCardsUploading
   * @param {Action} forbidCardsUploading - действие, которое
   * говорит, о том, что все данные загружены
   * @param {Action} allowCardsUploading - действие, которое
   * разрешает загрузку карточек снова через resetDoNotUploadTime
   * @param {BaseComponent} previewComponent - компонент,
   * который будет вложен в .feed__preview в ленте
   */
  constructor(
      storeName,
      SAVE_NEW_CARDS_ACTION,
      CLEAR_CARDS_ACTION,
      FORBID_CARDS_UPLOADING_ACTION,
      ALLOW_CARDS_UPLOADING_ACTION,
      forbidCardsUploading,
      allowCardsUploading,
      previewComponent = new BaseComponent(),
  ) {
    console.log('{FEED} creation with params:');
    console.log({storeName});
    console.log({SAVE_NEW_CARDS_ACTION});
    console.log({CLEAR_CARDS_ACTION});
    console.log({forbidCardsUploading});
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
        store.subscribe(SAVE_NEW_CARDS_ACTION, ({idLastLoaded, cards}) => {
          if (!Array.isArray(cards)) {
            if (ajaxDebug) {
              console.warn('API ERROR! Server must return array of Cards',
                  'but returned', typeof cards, ':', {cards});
            }
            return;
          }

          this.view.addCards(cards);

          const endFound = store.getState()[storeName].isEndFound;
          if (endFound) {
            if (ajaxDebug) {
              console.log(`{${storeName}FEED}
              'end' found. isEndFound flag is true`);
            }
            this.view.hideLoadingAnimation();
            // асинхронное событие (выполняется с помощью преобразователя)
            // разрешает загрузку карточек спустя некоторое время
            store.dispatch((dispatch) => {
              setTimeout(() => {
                if (ajaxDebug) {
                  console.log('{FEED} isEndFound flag is reset to false');
                }
                dispatch(allowCardsUploading());
              }, resetDoNotUploadTime);
            });
          }
        }),
        store.subscribe(
            CLEAR_CARDS_ACTION,
            () => this.view.clear(),
        ),
        store.subscribe(
            ALLOW_CARDS_UPLOADING_ACTION,
            () => this.view.showLoadingAnimation(),
        ),
        store.subscribe(
            FORBID_CARDS_UPLOADING_ACTION,
            () => this.view.hideLoadingAnimation(),
        ),
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

    if (store.getState()[this.storeName].isEndFound) {
      this.view.hideLoadingAnimation();
    }
    return this.root;
  }
}
