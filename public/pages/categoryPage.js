import BasePageMV from './basePageMV.js';
import CategoryPageView from './categoryPageView.js';

import store from '../flux/store.js';
import {changePageActions, categoryPageActions} from '../flux/actions.js';
import {categoryPageTypes} from '../flux/types.js';

import Modal from '../components/modal/modal.js';

import Ajax from '../modules/ajax.js';

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
// function newsFeedEndReachEventAction(event) {
//   const state = store.getState().categoryPage;
//   const trackedCard = document.getElementById(state.trackedCardId);
//   // работаем, только если отслеживаемый элемент
//   // находися в области видимости пользователя
//   if (state.isLoading ||
//     trackedCard.getBoundingClientRect().y>Utils.getUserWindowHeight()) {
//     return;
//   }
//   console.log('scroll trigger');
//   store.dispatch(uploadNextCards);
// }

/**
 * Получить feedChunkSize записей (настройка на стороне сервера)
 */
async function uploadCategoryCards() {
  const state = store.getState().categoryPage;

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
        categoryPageActions.saveNewCategoryArticles(
            cards.length ? cards[cards.length - 1].id : state.idLastLoaded,
            cards,
        ),
    );
  };

  store.dispatch(categoryPageActions.setCategoryArticlesLoadingFlag());

  await Ajax.get({
    url: `/articles/tags?tag=${state.choosenTag}`,
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
  // TODO: в других лентах unsetLoadingFlag
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

    store.subscribe(categoryPageTypes.SELECT_CATEGORY_ARTICLES_TAG, () => {
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

    // const scrollable = document.querySelector('.content');
    // if (!scrollable) {
    //   console.error('нет дивака .content');
    // } else {
    //   scrollable.addEventListener(
    //       'scroll',
    //       newsFeedEndReachEventAction,
    //       false,
    //   );
    // }
  }

  /**
   * Скрыть подконтрольную страницу
   */
  hide() {
    super.hide();
  //   const scrollable = document.querySelector('.content');
  //   if (!scrollable) {
  //     console.error('нет дивака .content');
  //   } else {
  //     scrollable.removeEventListener(
  //         'scroll',
  //         newsFeedEndReachEventAction,
  //         false,
  //     );
  //   }
  }
}
