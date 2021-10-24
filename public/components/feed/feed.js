import BaseComponent from '../_basic/baseComponent.js';
import FeedView from './feedView.js';

import modalComponent from '../modal.js';

import Utils from '../../utils.js';
import Ajax from '../../modules/ajax.js';

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
 * Получить feedChunkSize записей (настройка на стороне сервера)
 * и отрисовать их перед loadingCard
 */
function uploadNextCards() {
  const state = store.getState().mainPage;

  if (state.doNotUpload || state.isLoading) {
    if (ajaxDebug) {
      console.log('can\'t load news as doNotUpload state flag is true');
    }
    return;
  }

  /**
   * Обработчик для ответа с сервера
   * @param {Object} cards
   */
  function onLoad(cards) {
    if (ajaxDebug) {
      console.log('more news loaded!');
    }

    store.dispatch(
        mainPageActions.saveNewCards(
            cards.length ? cards[cards.length - 1].id : state.idLastLoaded,
            cards,
        ),
    );
  };

  store.dispatch(mainPageActions.setLoadingFlag());

  Ajax.get({
    url: `/articles/feed?idLastLoaded=${state.idLastLoaded || ''}` +
      '&login=' +
      (state.login === '' ? 'all' : state.login),
  })
      .then(({status, response}) => {
        if (status === Ajax.STATUS.ok) {
          onLoad(response.data);
          return;
        }

        modalComponent.setTitle(`Ошибка сети ${status}`);
        modalComponent.setContent(response.msg);
        modalComponent.open(false);
      });
}

/**
 * Обработчик scroll, который можно будет удалить
 * Проверяет, достигнут ли конец ленты
 * @param {event} event
 */
function newsFeedEndReachEventAction(event) {
  const state = store.getState().mainPage;
  const trackedCard = document.getElementById(state.trackedCardId);
  // работаем, только если отслеживаемый элемент
  // находися в области видимости пользователя
  if (state.isLoading ||
    trackedCard.getBoundingClientRect().y>Utils.getUserWindowHeight()) {
    return;
  }
  console.log('scroll trigger');
  store.dispatch(uploadNextCards);
}


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
          const state = store.getState().mainPage;

          const trackedCard =
            this.view.root.querySelector(`#${state.trackedCardId}`);

          if (cards instanceof Array) {
            this.view.addCards(trackedCard, cards);

            if (cards[cards.length - 1]?.id === endOfFeedMarkerID) {
              // hide loading component
              trackedCard.style.visibility = 'hidden';
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
              console.warn('API ERROR! Server must return array of Cards');
            }
          }
        }),
    );

    // TODO: не виндоу, когда будет новая верстка
    window.addEventListener(
        'scroll',
        newsFeedEndReachEventAction,
        false,
    );
  }

  /**
  * @param {Array.Card} cards
  * @return {HTMLElement}
  */
  render() {
    super.render();

    const cards = store.getState().mainPage.cards;
    if (cards.length === 0) {
      store.dispatch(uploadNextCards);
    }
    this.root = this.view.render(cards);
    return this.root;
  }

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    super.destroy();
  }
}
