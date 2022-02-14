import {ProfilePageTypes, CommonTypes, FluxStateObject, FluxAction} from '../types';
import {Article} from '../../common/types';
import {User} from '../../common/types';

const endOfFeedMarkerID = 'end';

/**
 * Объект состояния для ленты
 * @typedef {Object} ProfileStateObject
 * @property {boolean} isLoading    - Идет ли загрузка сейчас. true запрещает
 *                                    отправку запросов на обновлении ленты,
 *                                    чтобы не спамить сервер
 * @property {boolean} isEndFound  - Запрещает загрузку при обнаружении конца
 *                                    ленты, чтобы не спамить сервер.
 *                                    Сбразывется через resetDoNotUploadTime мс
 * @property {Array<Article>} cards - Массив загруженных карточек для
 *                                    восстановления состояния при возвращении
 *                                    на MainPage
 * @property {number | 'end'} idLastLoaded
 * @property {User} user
 */

export interface ProfileStateObject extends FluxStateObject {
  user: User,
  isLoading: boolean,
  idLastLoaded: number | 'end',
  cards: Article[],
  isEndFound: boolean,
}

const InitialProfilePageState: ProfileStateObject = {
  user: {
    login: '',
    avatarUrl: '',
  },
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: 0,              // запоминаем последнюю загруженную запись
  cards: [],                     // массив загруженных новостей
  isEndFound: false,
};

export type ProfileAction = FluxAction<ProfilePageTypes | CommonTypes>;

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function profilePageReducer(
    state: ProfileStateObject = InitialProfilePageState,
    action: ProfileAction,
): ProfileStateObject {
  switch (action.type) {
    case ProfilePageTypes.SET_USER_ARTICLES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ProfilePageTypes.FORBID_USER_ARTICLES_UPLOADING:
      return {
        ...state,
        isEndFound: true,
      };
    case ProfilePageTypes.ALLOW_USER_ARTICLES_UPLOADING:
      return {
        ...state,
        isEndFound: false,
      };
    case ProfilePageTypes.SAVE_NEW_USER_ARTICLES:
      const cards = action.payload.cards;
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
    case ProfilePageTypes.CLEAR_USER_ARTICLES:
      return {
        ...state,
        cards: [],
        isLoading: false,
        idLastLoaded: 0,
        isEndFound: false,
      };
    case ProfilePageTypes.SET_USER_INFO: // смена пользователя
      return {
        ...state,
        user: action.payload,
        // Сброс загруженных карточек
        // TODO: сделать кеширование для кажлого юзера
        isLoading: false,
        idLastLoaded: 0,
        cards: [],
        isEndFound: false,
      };
    case ProfilePageTypes.SET_USER_LOADING: // смена пользователя
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        idLastLoaded: 0,
        cards: [],
        isEndFound: false,
      };
    case CommonTypes.DELETE_CARD: {
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
    case CommonTypes.LIKE_CARD:
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
        if ((likeCardCopy.liked ^ action.payload.sign) === 0) {
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
  return state;
}
