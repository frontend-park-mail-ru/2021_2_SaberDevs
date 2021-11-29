import BasePageMV from './basePageMV.js';
import SearchPageView from './searchPageView.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';
import searchActions from '../flux/actions/searchActions.js';
import {searchTypes} from '../flux/types.js';

import Modal from '../components/modal/modal.js';

import Ajax from '../modules/ajax.js';
import {getUserWindowHeight} from '../common/utils.js';
import {ajaxDebug} from '../globals.js';

// ///////////////////////////////// //
//
//              Search Page
//
// ///////////////////////////////// //

/**
 * Обработчик scroll, который можно будет удалить
 * Проверяет, достигнут ли конец ленты
 * @param {event} event
 */
function newsFeedEndReachEventAction({currentTarget}) {
  const state = store.getState().search;
  const trackedCard = currentTarget.querySelector('#feed__loading');
  // работаем, только если отслеживаемый элемент
  // находися в области видимости пользователя.
  // При этом не находимся в состоянии ожидания запроса
  // и трекинг-элемент не скрыт (при display: none - y = 0)
  if (state.isLoading || state.isEndFound ||
    trackedCard.getBoundingClientRect().y > getUserWindowHeight()) {
    return;
  }
  console.log('[Search Page] scroll trigger');
  store.dispatch(uploadNextCards);
}

/**
 * Получить feedChunkSize записей (настройка на стороне сервера)
 */
async function uploadNextCards() {
  const state = store.getState().search;

  if (state.isEndFound || state.isLoading) {
    if (ajaxDebug) {
      console.log('[Search Page] can\'t load news as' +
        'isEndFound state flag is true');
    }
    return;
  }

  /**
   * Обработчик для ответа с сервера
   * @param {Object} cards
   */
  function onLoad(cards) {
    if (ajaxDebug) {
      console.log('[Search Page] more news loaded!');
    }

    // модифицируем в случае с юзером для интеграции в ленту
    cards.forEach((card) => {
      if ('login' in card) {
        card.id = card.login;
      }
    });

    store.dispatch(
        searchActions.saveNewCards(
            // TODO:
            // cards.length ? cards[cards.length - 1].id : state.idLastLoaded,
            '',
            cards,
        ),
    );
  };

  store.dispatch(searchActions.setLoadingFlag());

  await Ajax.get({
    url: `/search/${state.group}?q=${state.value || ''}` +
      `&idLastLoaded=${state.idLastLoaded || ''}`,
  })
      .then(({status, response}) => {
        if (status === Ajax.STATUS.ok) {
          onLoad(response.data);
          return;
        }

        if (status / 500 === 1) {
          Modal.setTitle(`Сервис временно не доступен: ${status}`);
        }
        if (status / 400 === 1) {
          Modal.setTitle(/* пользовательская */`Ошибка ${status}`);
        }
        Modal.setContent(response.msg);
        Modal.open(false);
      })
      .catch((err) => console.warn(err.message));
  store.dispatch(searchActions.unsetLoadingFlag());
}

/**
 * @class SearchPage
 * @module SearchPage
 */
export default class SearchPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new SearchPageView(root);

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    // обновить ленту если параметры поиска изменились
    const updateFeed = (category) => {
      if (category !== '') {
        store.dispatch(searchActions.clearCards());
        store.dispatch(searchActions.allowCardsLoading());
        uploadNextCards();
      }
      // TODO: параметры поиска в url
      // history.pushState(
      //     null,
      //     '',
      //     '/search' + (category !== '' ? '/' + category : ''),
      // );
      // меняем и тайтл
      // store.dispatch(
      //     changePageActions.changePage(
      //         'categories',
      //         `SaberProject |
      //         ${category !== '' ?
      //         (category.charAt(0).toUpperCase() + category.slice(1)) :
      //         'Categories'}`,
      //     ),
      // );
    };

    store.subscribe(searchTypes.SET_SEARCH_VALUE, updateFeed);
    store.subscribe(searchTypes.SET_SEARCH_GROUP, updateFeed);
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();
    store.dispatch(
        changePageActions.changePage(
            'search',
            `SaberProject | Search`,
        ),
    );

    if (store.getState().search.cards.length === 0) {
      store.dispatch(uploadNextCards);
    }

    const scrollable = this.view.root.querySelector('.content');
    if (!scrollable) {
      console.warn('[Search Page] нет дивака .content');
    } else {
      scrollable.addEventListener(
          'scroll',
          newsFeedEndReachEventAction,
      );
    }
  }

  /**
   * Скрыть подконтрольную страницу
   */
  hide() {
    super.hide();
    const scrollable = this.view.root.querySelector('.content');
    if (!scrollable) {
      console.warn('[SearchPage] нет дивака .content');
    } else {
      scrollable.removeEventListener(
          'scroll',
          newsFeedEndReachEventAction,
      );
    }
  }

  /**
   * true - эдемент активен, его нежелательно перетирать
   * @return {boolean}
   */
  isActive() {
    // TODO: получить параметры из поиска
    // let group = '';
    // let value = '';
    // const idx = document.URL.indexOf('search/');
    // if (idx !== -1) {
    //   try {
    //     category = decodeURI(document.URL.slice(idx + ));
    //   } catch (e) {
    //     console.error(e);
    //   }
    //   console.log('[CategoryPage] (isActive) category from Url:',
    //       category);
    //   store.dispatch(categoryPageActions.selectCategory(category));
    // } else if (document.URL.indexOf('categories') !== -1) {
    //   // Если была выбрана категория, но юзер перешел по урлу на categories
    //   store.dispatch(categoryPageActions.clearSelectedCategory());
    // }

    // // Чтобы спрятать анимацию загрузки, пока Category не выбранa
    // if (store.getState().categoryPage.currentCategory === '') {
    //   store.dispatch(categoryPageActions.forbidCategoryArticlesLoading());
    // }

    return super.isActive();
  }
}
