import BasePageMV from './basePageMV.js';
import CategoryPageView from './categoryPageView.js';

import store from '../flux/store.js';
import {changePageActions, categoryPageActions} from '../flux/actions.js';
import {categoryPageTypes} from '../flux/types.js';

import Modal from '../components/modal/modal.js';

import Ajax from '../modules/ajax.js';
import {getUserWindowHeight} from '../utils.js';

// ///////////////////////////////// //
//
//             Category Page
//
// ///////////////////////////////// //

/**
 * Обработчик scroll, который можно будет удалить
 * Проверяет, достигнут ли конец ленты
 * @param {event} event
 */
function newsFeedEndReachEventAction({currentTarget}) {
  const state = store.getState().categoryPage;
  const trackedElement = currentTarget.querySelector('#feed__loading');
  // работаем, только если отслеживаемый элемент
  // находися в области видимости пользователя
  if (state.isLoading || state.isEndFound ||
    trackedElement.getBoundingClientRect().y > getUserWindowHeight()) {
    return;
  }
  console.log('[Category Page] scroll trigger');
  store.dispatch(uploadCategoryCards);
}

/**
 * Получить feedChunkSize записей (настройка на стороне сервера)
 */
async function uploadCategoryCards() {
  const state = store.getState().categoryPage;

  if (state.isEndFound || state.isLoading) {
    if (ajaxDebug) {
      console.log('[Category Page] Can\'t load articles on ' +
        'as isEndFound state flag is true');
    }
    return;
  }

  /**
   * Обработчик для ответа с сервера
   * @param {Object} cards
   */
  function onLoad(cards) {
    if (ajaxDebug) {
      console.log('[Category Page] more news loaded!');
    }

    store.dispatch(
        categoryPageActions.saveNewCategoryArticles(
            cards.length ? cards[cards.length - 1].id : state.idLastLoaded,
            cards,
        ),
    );
  };

  store.dispatch(categoryPageActions.setCategoryArticlesLoadingFlag());

  await Ajax.get({
    url: `/articles/tags?idLastLoaded=${state.idLastLoaded}` +
        `&tag=${state.choosenTag}`,
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
  store.dispatch(categoryPageActions.unsetCategoryArticlesLoadingFlag());
}

/**
 * @class CategoryPage
 */
export default class CategoryPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new CategoryPageView(root);

    // Communication
    store.subscribe(categoryPageTypes.SELECT_CATEGORY_ARTICLES_TAG, () => {
      store.dispatch(categoryPageActions.clearCategoryArticles());
      store.dispatch(categoryPageActions.allowCategoryArticlesLoading());
      uploadCategoryCards();
    });
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();
    store.dispatch(
        changePageActions.changePage(
            'categories',
            `SaberProject | Categories`,
        ),
    );

    // Чтобы спрятать анимацию загрузки, пока теги не выбраны
    // TODO: проверка массива
    if (store.getState().categoryPage.choosenTag === '') {
      store.dispatch(categoryPageActions.forbidCategoryArticlesLoading());
    }


    const scrollable = document.querySelector('.content');
    if (!scrollable) {
      console.warn('[Category Page] нет дивака .content');
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
    const scrollable = document.querySelector('.content');
    if (!scrollable) {
      console.warn('[Category Page] нет дивака .content');
    } else {
      scrollable.removeEventListener(
          'scroll',
          newsFeedEndReachEventAction,
      );
    }
  }
}
