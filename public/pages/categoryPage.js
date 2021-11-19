import BasePageMV from './basePageMV.js';
import CategoryPageView from './categoryPageView.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';
import categoryPageActions from '../flux/actions/categoryPageActions.js';
import {categoryPageTypes, editorTypes} from '../flux/types.js';

import Modal from '../components/modal/modal.js';

import Ajax from '../modules/ajax.js';
import {getUserWindowHeight} from '../common/utils.js';

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
        `&tag=${state.currentCategory}`,
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

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    // обновить ленту в соответствии с фильтром
    store.subscribe(categoryPageTypes.SELECT_CATEGORY, (category) => {
      store.dispatch(categoryPageActions.clearCategoryArticles());
      store.dispatch(categoryPageActions.allowCategoryArticlesLoading());
      uploadCategoryCards();
      history.pushState(null, '', '/categories/' + category);
      // меняем и тайтл
      store.dispatch(
          changePageActions.changePage(
              'categories',
              `SaberProject |
              ${category.charAt(0).toUpperCase() + category.slice(1)} category`,
          ),
      );
    });

    // Обновить ленту, если есть изменения в статье или пользователь
    // опубликовал новую
    store.subscribe(editorTypes.PUBLISH_ARTICLE, () => {
      store.dispatch(categoryPageActions.clearCategoryArticles());
    });
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();

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

  /**
   * true - эдемент активен, его нежелательно перетирать
   * @return {boolean}
   */
  isActive() {
    let category = '';
    const idx = document.URL.indexOf('categories/');
    if (idx !== -1) {
      try {
        category = decodeURI(document.URL.slice(idx + 11));
      } catch (e) {
        console.error(e);
      }
      console.log('[CategoryPage] (isActive) category from Url:',
          category);
      store.dispatch(categoryPageActions.selectCategory(category));
    } else if (document.URL.indexOf('categories') !== -1) {
      // Если была выбрана категория, но юзер перешел по урлу на categories
      store.dispatch(categoryPageActions.clearSelectedCategory());
    }

    store.dispatch(
        changePageActions.changePage(
            'categories',
            `SaberProject |
            ${category.charAt(0).toUpperCase() + category.slice(1)} category`,
        ),
    );

    // Чтобы спрятать анимацию загрузки, пока Category не выбранa
    if (store.getState().categoryPage.currentCategory === '') {
      store.dispatch(categoryPageActions.forbidCategoryArticlesLoading());
    }

    return super.isActive();
  }
}
