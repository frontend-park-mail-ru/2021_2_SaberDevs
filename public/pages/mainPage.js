import BasePageMV from './basePageMV.js';
import MainPageView from './mainPageView.js';

import store from '../flux/store.js';
import {changePageActions, mainPageActions} from '../flux/actions.js';
import {editorTypes} from '../flux/types.js';

import Modal from '../components/modal/modal.js';

import Ajax from '../modules/ajax.js';
import {getUserWindowHeight} from '../common/utils.js';

// ///////////////////////////////// //
//
//              Main Page
//
// ///////////////////////////////// //

/**
 * Обработчик scroll, который можно будет удалить
 * Проверяет, достигнут ли конец ленты
 * @param {event} event
 */
function newsFeedEndReachEventAction({currentTarget}) {
  const state = store.getState().mainPage;
  const trackedCard = currentTarget.querySelector('#feed__loading');
  // работаем, только если отслеживаемый элемент
  // находися в области видимости пользователя.
  // При этом не находимся в состоянии ожидания запроса
  // и трекинг-элемент не скрыт (при display: none - y = 0)
  if (state.isLoading || state.isEndFound ||
    trackedCard.getBoundingClientRect().y > getUserWindowHeight()) {
    return;
  }
  console.log('[Main Page] scroll trigger');
  store.dispatch(uploadNextCards);
}

/**
 * Получить feedChunkSize записей (настройка на стороне сервера)
 */
async function uploadNextCards() {
  const state = store.getState().mainPage;
  const stateAuth = store.getState().authorization;

  if (state.isEndFound || state.isLoading) {
    if (ajaxDebug) {
      console.log('[Main Page] can\'t load news as' +
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
      console.log('[Main Page] more news loaded!');
    }

    store.dispatch(
        mainPageActions.saveNewCards(
            cards.length ? cards[cards.length - 1].id : state.idLastLoaded,
            cards,
        ),
    );
  };

  store.dispatch(mainPageActions.setLoadingFlag());

  await Ajax.get({
    url: `/articles/feed?idLastLoaded=${state.idLastLoaded || ''}` +
      '&login=' +
      (stateAuth.isAuthenticated ? stateAuth.login : 'all'),
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
  store.dispatch(mainPageActions.unsetLoadingFlag());
}

/**
 * @class MainPage
 * @module MainPage
 */
export default class MainPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new MainPageView(root);

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    // TODO: (неприоритет) добавить экшны на обновление записи и удаление, чтобы
    // не скачивать ленту еще раз. Во всех лентах.
    // Обновить ленту, если есть изменения в статье или пользователь
    // опубликовал новую
    store.subscribe(editorTypes.PUBLISH_ARTICLE, () => {
      store.dispatch(mainPageActions.clearCards());
    });
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();
    store.dispatch(
        changePageActions.changePage(
            'main',
            `SaberProject`,
        ),
    );

    if (store.getState().mainPage.cards.length === 0) {
      store.dispatch(uploadNextCards);
    }

    const scrollable = this.view.root.querySelector('.content');
    if (!scrollable) {
      console.warn('[Main Page] нет дивака .content');
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
      console.warn('[MainPage] нет дивака .content');
    } else {
      scrollable.removeEventListener(
          'scroll',
          newsFeedEndReachEventAction,
      );
    }
  }
}
