import BaseComponent from '../_basic/baseComponent.js';
import FeedView from './feedView.js';

import {redirect} from '../../common/utils.js';

import store from '../../flux/store.js';
import profilePageActions from '../../flux/actions/profilePageActions.js';
import readerActions from '../../flux/actions/readerActions.js';
import {authorizationTypes} from '../../flux/types.js';
import {ajaxDebug} from '../../globals.js';
import Likes from '../likes/likes.js';

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
 * Создает обработчики клика на разные участки карточки
 * Монтирует компонент лайков
 * @param {HTMLElement} where место, где искать смонтированные шаблонизатором
 * карточки
 * @param {Array<Card>} cards массив с данными, по которым
 * карточки монтировались
 * @param {function} dispatchLike
 */
function upgradeCards(where, cards, dispatchLike) {
  cards.forEach((card) => {
    const cardDiv = where.querySelector('#card' + card.id);
    if (cardDiv === null) {
      console.warn('{Feed} card with id', card.id, 'has mounted with error');
      return;
    }

    cardDiv.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTarget = e.currentTarget;
      store.dispatch(readerActions.setArticleLoading(card));
      redirect('/article/' + currentTarget.id.replace('card', ''));
    });

    cardDiv.querySelector('.card__author').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          store.dispatch(profilePageActions.setUserInfo(card.author));
          redirect('/user/' + card.author.login);
        },
    );

    cardDiv.querySelector('.category').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          redirect('/categories/' + card.category);
        },
    );

    cardDiv.querySelectorAll('.tags__tag').forEach((t) => t.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          redirect('/search?g=tags&q=' + e.currentTarget.textContent);
        },
    ));

    cardDiv.querySelector('.action-btns__comments-icon')
        .addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.warn('клик по комментам');
          redirect('/article/'+ cardDiv.id.replace('card', '')+'#comments');
        });

    // лайки
    const likesComponent = new Likes(
        0,
        parseInt(card.id, 10),
        card.likes,
        card.liked,
        dispatchLike,
    );
    likesComponent.mountInPlace(cardDiv);
  });
}
/**
 * ViewModel-компонент соответсвующего View
 * @class Feed
 */
export default class Feed extends BaseComponent {
  /**
   * Универсальный компонент ленты
   * @param {function} composeCards принимает root - HTMLElement, к которому
   * аппендятся карточки и массив данных, по которому строятся шаблоны
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
   * @param {function<string, number, number>} like
   * @param {BaseComponent} previewComponent - компонент,
   * который будет вложен в .feed__preview в ленте
   */
  constructor(
      composeCards,
      storeName,
      SAVE_NEW_CARDS_ACTION,
      CLEAR_CARDS_ACTION,
      FORBID_CARDS_UPLOADING_ACTION,
      ALLOW_CARDS_UPLOADING_ACTION,
      forbidCardsUploading,
      allowCardsUploading,
      like,
      previewComponent = new BaseComponent(),
  ) {
    console.log('{FEED} creation with params:');
    console.log({storeName});

    super();
    this.innerComponent = previewComponent;
    this.storeName = storeName;
    this.dispatchLike = (id, sign, newLikesNum) => store.dispatch(
        like(id, sign, newLikesNum),
    );
    const cards = store.getState()[storeName].cards;
    this.view = new FeedView(
        composeCards,
        previewComponent.render().outerHTML,
        cards,
    );

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
          upgradeCards(
              this.view.root.querySelector(`.feed__cards`),
              cards,
              (id, sign, newLikesNum)=>this.dispatchLike(id, sign, newLikesNum),
          );

          const endFound = store.getState()[storeName].isEndFound;
          if (endFound) {
            if (ajaxDebug) {
              console.log(`{${storeName}FEED}\
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
        // Отмечаем пролайканные карточки
        // store.subscribe(
        //     authorizationTypes.LOGIN,
        //     // TODO: сделать апишку по которой я получу те карточки
        //     // из текущей ленты, которые я лайкал
        //     (userData) => this.view.setLikes(userData.login),
        // ),
        // Стираем отметки о лайках
        store.subscribe(
            authorizationTypes.LOGOUT,
            () => this.view.clearLikes(),
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

    upgradeCards(
        this.view.root.querySelector(`.feed__cards`),
        cards,
        (id, sign, newLikesNum) => this.dispatchLike(id, sign, newLikesNum),
    );

    if (store.getState()[this.storeName].isEndFound) {
      this.view.hideLoadingAnimation();
    }
    return this.root;
  }
}
