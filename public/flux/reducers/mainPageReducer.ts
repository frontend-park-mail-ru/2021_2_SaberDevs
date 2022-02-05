import {MainPageTypes, CommonTypes, FluxStateObject, FluxAction} from '../types';
import {Article, ArticleId} from './readerReducer';

const endOfFeedMarkerID = 'end';

/**
 * Объект состояния на главной странице
 * @typedef {Object} MainPageStateObject
 * @property {ArticleId} idLastLoaded  - ID последней загруженной карточки
 * @property {boolean} isLoading       - Идет ли загрузка сейчас. true запрещает
 *                                       отправку запросов на обновлении ленты,
 *                                       чтобы не спамить сервер
 * @property {boolean} isEndFound      - Запрещает загрузку при обнаружении конца
 *                                       ленты, чтобы не спамить сервер.
 *                                       Сбразывется через resetDoNotUploadTime мс
 * @property {Array<Article>} cards    - Массив загруженных карточек для
 *                                       восстановления состояния при возвращении
 *                                       на MainPage
 */

export interface MainPageStateObject extends FluxStateObject {
  isLoading: boolean,
  idLastLoaded: ArticleId,
  cards: Article[],
  isEndFound: boolean,
};

const InitialMainPageState: MainPageStateObject = {
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: 0,               // запоминаем последнюю загруженную запись
  cards: [],                     // массив загруженных новостей
  isEndFound: false,
};

export type MainPageAction = FluxAction<CommonTypes | MainPageTypes>;

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function mainPageReducer(state: MainPageStateObject = InitialMainPageState, action: MainPageAction): MainPageStateObject {
  switch (action.type) {
    case MainPageTypes.SET_LOADING_FLAG:
      return {
        ...state,
        isLoading: true,
      };
    case MainPageTypes.FORBID_CARDS_UPLOADING:
      return {
        ...state,
        isEndFound: true,
      };
    case MainPageTypes.ALLOW_CARDS_UPLOADING:
      return {
        ...state,
        isEndFound: false,
      };
    case MainPageTypes.SAVE_NEW_CARDS:
      const cards = action.payload.cards;
      cards.forEach((element) => {
        if (!Array.isArray(element.tags)) {
          console.warn('API Error | server return ' +
            'tags which do not represent an array');
          element.tags = [];
        }
      });
      if (cards.length === 0) {
        return {
          ...state,
          isLoading: false,
        };
      }
      // запрещаем загрузку карточек, чтобы не спамить сервер
      const isEndFound = cards[cards.length - 1].id === endOfFeedMarkerID;
      if (isEndFound) {
        // Удаляем последнюю запись с end'ом
        cards.splice(cards.length - 1, 1);
      }
      return {
        ...state,
        isLoading: false,
        idLastLoaded: cards[cards.length - 1]?.id || state.idLastLoaded,
        cards: state.cards.concat(cards),
        isEndFound,
      };
    case MainPageTypes.CLEAR_CARDS:
      return {
        ...state,
        cards: [],
        isLoading: false,
        idLastLoaded: '',
        lastScrollPos: 0,
        isEndFound: false,
      };
    case MainPageTypes.DELETE_CARD: {
      const idx = state.cards.findIndex((card) => card.id === action.payload);
      if (idx !== -1) {
        return {
          ...state,
          cards: state.cards.slice(0, idx).concat(state.cards.slice(idx + 1)),
        };
      } else {
        return state;
      }
    }
    case MainPageTypes.LIKE: {  // TODO: распространить на другие ленты, ридер
      const idx = state.cards.findIndex((card) => card.id===action.payload.id);
      if (idx !== -1) {
        const likeCardCopy = JSON.parse(JSON.stringify(state.cards[idx]));
        /*
          liked 0  | sign 1  => liked 1
          liked -1 | sign 1  => liked 1
          liked 1  | sign 1  => liked 0
          liked 0  | sign -1 => liked -1
          liked -1 | sign -1 => liked 0
          liked 1  | sign -1 => liked -1
        */
        if (likeCardCopy.liked ^ action.payload.sign === 0) {
          likeCardCopy.liked = 0; // отменили оценку
        } else {
          likeCardCopy.liked = action.payload.sign;
        }
        likeCardCopy.likes = action.payload.likes;
        return {
          ...state,
          cards: state.cards.slice(0, idx)
              .concat([likeCardCopy])
              .concat(state.cards.slice(idx + 1)),
        };
      } else {
        return state;
      }
    }
  }
  return state;
}
