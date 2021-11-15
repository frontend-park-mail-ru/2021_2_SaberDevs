import {categoryPageTypes} from '../types.js';

const endOfFeedMarkerID = 'end';

/**
 * Объект состояния на главной странице
 * @typedef {Object} CategoryPageState
 *                                    вызовет подгрузку новостей
 * @property {string} idLastLoaded  - ID последней загруженной карточки
 * @property {boolean} isLoading    - Идет ли загрузка сейчас. true запрещает
 *                                    отправку запросов на обновлении ленты,
 *                                    чтобы не спамить сервер
 * @property {number} lastScrollPos - Позиция скролла при покидании mainPage
 * @property {boolean} isEndFound  - Запрещает загрузку при обнаружении конца
 *                                    ленты, чтобы не спамить сервер.
 *                                    Сбразывется через resetDoNotUploadTime мс
 * @property {Array.NewsCard} cards - Массив загруженных карточек для
 *                                    восстановления состояния при возвращении
 *                                    на MainPage
 */
const InitialCategoryPageState = {
  currentCategory: '',            // категория, по которой фильтруются записи
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  lastScrollPos: 0,              // скрол для возврата к той же записи
  cards: [],                     // массив загруженных новостей
  isEndFound: false,
  tags: {
    // category: {
    //  tag1: false,
    //  tag2: true,
    // }
  },
  // TODO: разобраться с категорями
  choosenTag: '',
};

/**
 * @param {Object} state
 * @param {Action} action
 * @return {Object}
 */
export default function categoryPageReducer(
    state = InitialCategoryPageState,
    action,
) {
  switch (action.type) {
    case categoryPageTypes.SET_CATEGORY_ARTICLES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case categoryPageTypes.UNSET_CATEGORY_ARTICLES_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case categoryPageTypes.FORBID_CATEGORY_ARTICLES_UPLOADING:
      return {
        ...state,
        isEndFound: true,
      };
    case categoryPageTypes.ALLOW_CATEGORY_ARTICLES_UPLOADING:
      return {
        ...state,
        isEndFound: false,
      };
    case categoryPageTypes.SAVE_NEW_CATEGORY_ARTICLES:
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
    case categoryPageTypes.CLEAR_CATEGORY_ARTICLES:
      return {
        ...state,
        cards: [],
        isLoading: false,
        idLastLoaded: '',
        lastScrollPos: 0,
        isEndFound: false,
      };
    case categoryPageTypes.ADD_TAG:
      if (state.currentCategory !== '') {
        for (const category in state.tags) {
          if (action.payload in category) {
            category[action] = true;
          }
        }
      }
      const tagsChanged = {...state.tags};
      tagsChanged[currentCategory][action.payload] = true;
      return {
        ...state,
        tags: {
          ...state.tags,
          tags: tagsChanged,
        },
      };
    case categoryPageTypes.REMOVE_TAG:
      if (state.currentCategory !== '') {
        for (const category in state.tags) {
          if (action.payload in category) {
            category[action] = false;
          }
        }
      }
      const tagsChanged2 = {...state.tags};
      tagsChanged[currentCategory][action.payload] = false;
      return {
        ...state,
        tags: {
          ...state.tags,
          tags: tagsChanged2,
        },
      };
    case categoryPageTypes.CLEAR_TAGS:
      const clearedTags = {};
      for (const category in state) {
        clearedTags[category] = {};
        state[category].forEach((tag) => {
          clearedTags[category][tag] = false;
        });
      }
      return {
        ...state,
        tags: clearedTags,
      };
    case categoryPageTypes.SET_CATEGORY:
      return {
        ...state,
        currentCategory: action.payload,
      };
    case categoryPageTypes.RESET_CATEGORY:
      return {
        ...state,
        currentCategory: '',
      };
    case categoryPageTypes.LOAD_TAGS:
      const loadedTags = {};
      for (const category in action.payload) {
        loadedTags[category] = {};
        action.payload[category].forEach((tag) => {
          loadedTags[category][tag] = false;
        });
      }
      return {
        ...state,
        tags: loadedTags,
      };
    // TODO: разобраться с категорями
    case categoryPageTypes.SELECT_CATEGORY_ARTICLES_TAG:
      return {
        ...state,
        idLastLoaded: '',
        choosenTag: action.payload,
      };
    case categoryPageTypes.CLEAR_CATEGORY_ARTICLES_TAG:
      return {
        ...state,
        idLastLoaded: '',
        choosenTag: '',
      };
  }
  return state;
}
