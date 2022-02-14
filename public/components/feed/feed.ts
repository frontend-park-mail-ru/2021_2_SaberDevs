import BaseComponent from '../_basic/baseComponent';
import FeedView from './feedView';

import {redirect} from '../../common/utils.js';

import store from '../../flux/store';
import profilePageActions from '../../flux/actions/profilePageActions';
import readerActions from '../../flux/actions/readerActions';
import {AuthorizationTypes, FluxActionType} from '../../flux/types';
import {ajaxDebug} from '../../globals';
import Likes from '../likes/likes';

import {KeyElementsMapFeed} from './FeedView';
import {FluxAction} from '../../flux/types';
import {FeedCard} from './feedView';
import {ComposeFunction} from './composeCardStandart';

const resetDoNotUploadTime = 6000;  // anti- brutforce

/**
 * Создает обработчики клика на разные участки карточки
 * Монтирует компонент лайков
 * @param {HTMLElement} where место, где искать смонтированные шаблонизатором
 * карточки
 * @param {Array<FeedCard>} cards массив с данными, по которым
 * карточки монтировались
 * @param {Function<number, number, number>} dispatchLike
 */
function upgradeCards(where: HTMLElement, cards: FeedCard[], dispatchLike: (id: number, sign: number, newLikesNum: number) => void) {
  cards.forEach((card) => {
    const cardDiv = <HTMLElement> where.querySelector('#card' + card.id);
    if (cardDiv === null) {
      console.warn('{Feed} card with id', card.id, 'has mounted with error');
      return;
    }

    cardDiv.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const currentTarget = <HTMLElement>e.currentTarget;
      store.dispatch(readerActions.setArticleLoading(card));
      redirect('/article/' + currentTarget.id.replace('card', ''));
    });

    cardDiv.querySelector('.card__author').addEventListener(
        'click',
        (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          store.dispatch(profilePageActions.setUserInfo(card.author));
          redirect('/user/' + card.author.login);
        },
    );

    cardDiv.querySelector('.category').addEventListener(
        'click',
        (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          redirect('/categories/' + card.category);
        },
    );

    cardDiv.querySelectorAll('.tags__tag').forEach((t) => t.addEventListener(
        'click',
        (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          redirect('/search?g=tags&q=' + (<HTMLElement>e.currentTarget).textContent);
        },
    ));

    cardDiv.querySelector('.action-btns__comments-icon')
        .addEventListener('click', (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          console.warn('клик по комментам');
          redirect('/article/'+ cardDiv.id.replace('card', '')+'#comments');
        });

    // лайки
    const likesComponent = new Likes(
        0,
        // TODO: разобраться с АПИ
        // parseInt(card.id, 10),
        card.id,
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
  preview: BaseComponent | null = null;
  storeName: string;
  dispatchLike: (id: number, sign: number, newLikesNum: number) => void;
  cards: FeedCard[];
  view: FeedView;

  /**
   * Универсальный компонент ленты
   * @param {Function} composeCards принимает root - HTMLElement, к которому
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
   * @param {Function<number, number, number> => FluxAction} like - метод, который
   * формирует
   * @param {BaseComponent? = <string> null} previewComponent - компонент,
   * который будет вложен в .feed__preview в начало ленты
   */
  constructor(
      composeCards: ComposeFunction,
      storeName: string,
      SAVE_NEW_CARDS_ACTION: FluxActionType,
      CLEAR_CARDS_ACTION: FluxActionType,
      FORBID_CARDS_UPLOADING_ACTION: FluxActionType,
      ALLOW_CARDS_UPLOADING_ACTION: FluxActionType,
      forbidCardsUploading: () => void,
      allowCardsUploading: () => void,
      like: (id: number, sign: number, numLikes: number) => FluxAction,
      previewComponent: BaseComponent = null,
  ) {
    super();

    this.preview = previewComponent;
    this.storeName = storeName;
    this.dispatchLike = (id, sign, newLikesNum) => store.dispatch(
        like(id, sign, newLikesNum),
    );
    this.view = new FeedView(composeCards);

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    this.unsubscribes.push(
        store.subscribe(SAVE_NEW_CARDS_ACTION, ({cards}: {cards: FeedCard[]}) => {
          this.view.addCards(cards);
          upgradeCards(
              this.view.root.querySelector(`.feed__cards`),
              cards,
              (id, sign, newLikesNum) => this.dispatchLike(id, sign, newLikesNum),
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
        //     AuthorizationTypes.LOGIN,
        //     // TODO: сделать апишку по которой я получу те карточки
        //     // из текущей ленты, которые я лайкал
        //     (userData) => this.view.setLikes(userData.login),
        // ),
        // Стираем отметки о лайках
        store.subscribe(
            AuthorizationTypes.LOGOUT,
            () => this.view.clearLikes(),
        ),
    );
  }

  get keyElems(): KeyElementsMapFeed {
    return this.view.keyElems;
  }
  
  /**
  * @return {HTMLElement}
  */
  render(): HTMLElement {
    super.render();

    const cards = <FeedCard[]>store.getState()[this.storeName].cards;
    this.root = this.view.render(cards, this.preview?.render());

    upgradeCards(
      this.keyElems.cardsBox,
        cards,
        (id: number, sign: number, newLikesNum: number) => this.dispatchLike(id, sign, newLikesNum),
    );

    if (store.getState()[this.storeName].isEndFound) {
      this.view.hideLoadingAnimation();
    }
    return this.root;
  }
}
