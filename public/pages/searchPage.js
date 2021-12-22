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

const searchGroups = {
  articles: ['articles', 'Статьи'],
  author: ['author', 'Пользователи'],
  tags: ['tags', 'Теги,'],
};
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

  if (state.isEndFound || state.isLoading || state.value === '') {
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
      console.log('[Search Page] more news loaded!', cards);
    }

    // модифицируем в случае с юзером для интеграции в ленту
    cards.forEach((card) => {
      if ('login' in card) {
        card.id = card.login;
      }
    });

    // ничего не найдено, если сервер возвращает end первой записью
    if (store.getState().search.cards.length === 0 &&
        cards.length > 0 && cards[0].id === 'end') {
      store.dispatch(searchActions.showEmptyFeed());
    }
    // в любом случае обрабатываем ответ в хранилище
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
    this.rendered = false;

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    // обновить ленту если параметры поиска изменились
    store.subscribe(
        searchTypes.REQUEST,
        () => {
          store.dispatch(searchActions.clearCards());
          store.dispatch(searchActions.allowCardsLoading());
          this.view.pageComponents.searchBar.clearMessage();
          uploadNextCards();
          const {group, value} = store.getState().search;
          store.dispatch(
              changePageActions.changeDocTitle(
                  `SaberProject | Search /` +
                  `${group[0].toUpperCase() + group.substr(1)} / ${value}`,
              ),
          );
          history.pushState(
              null,
              '',
              `/search?g=${group}&q=${value}`,
          );
        },
    );

    // вторая подписка на сабмит находится в хедере. Она редиректит на
    // эту страницу. Если эта страница открыта, страница не перендерится
    // url не спарсится, нужно вызывать upload-action вручную, но тогда
    // поиск не сохранится в HISTORY API. запись в хистори в update-subscribe
    store.subscribe(searchTypes.SUBMIT_ON_HEADER, () => {
      if (this.isActive()) {
        store.dispatch(searchActions.upload());
      }
    });
    store.subscribe(searchTypes.SUBMIT, () => {
      store.dispatch(searchActions.upload());
    });
    store.subscribe(searchTypes.SHOW_EMPTY_FEED, () => {
      this.view.pageComponents.searchBar.showMessage(
          'Мы не нашли ничего подходящего',
          'Попробуйте изменить параметры запроса',
      );
    });
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

    const scrollable = this.view.root.querySelector('.content');
    if (!scrollable) {
      console.warn('[Search Page] нет дивака .content');
    } else {
      scrollable.addEventListener(
          'scroll',
          newsFeedEndReachEventAction,
      );
    }

    // обработать параметры url
    let group = '';
    let value = '';
    const idx = document.URL.indexOf('search') + 6;
    // 'search' / 'search/' case
    if (idx === document.URL.length || document.URL[idx] === '/') {
      emptyQueryParamsAction();
      return;
    }
    const params = document.URL.substr(idx);
    let queryBegin = params.indexOf('&q=');
    if (queryBegin === -1) {
      queryBegin = params.indexOf('?q=');
    }
    if (queryBegin === -1) {
      emptyQueryParamsAction();
      return;
    }

    value = params.substr(queryBegin + 3);

    if (value === '') {
      emptyQueryParamsAction();
      return;
    }

    const groupBegin = params.indexOf('?g=');
    if (groupBegin === -1) {
      group = 'articles';
    } else {
      group = params.substring(group + 3, queryBegin);
    }

    try {
      group = decodeURI(group);
      value = decodeURI(value);
    } catch (e) {
      console.error(e);
    }

    console.warn('[SearchPage] query-params: ', {group}, {value});

    if (!(group in searchGroups)) {
      group = 'articles';
    }

    store.dispatch(searchActions.setSearchGroup(...searchGroups[group]));
    store.dispatch(searchActions.setSearchValue(value));
    store.dispatch(searchActions.upload());

    // как-то получили url параметры
    // если они есть > засетить dispatch group/value
    //
    // if (store.getState().search.cards.length === 0) {
    //   store.dispatch(uploadNextCards);
    // }

    // при первом рендере всегда бери данные из стора
    // если не заданы query-параметры
    // решаем проблему: ввели на главной параметры, нажали ентер
    // страница рендерится впервые. Нет подписки на submit action
    if (this.rendered) {
      this.rendered = true;
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
};

const emptyQueryParamsAction = () => {
  store.dispatch(searchActions.setSearchGroup(...searchGroups.articles));
  store.dispatch(searchActions.setSearchValue(''));
  console.warn('[SearchPage] query-params: ',
      {group: 'articles'}, {value: ''});
  store.dispatch(searchActions.forbidCardsLoading());
};

