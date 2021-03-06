import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import composeCards from '../components/feed/composeCardStandart.js';
import CategoryChoiceBar from
  '../components/categoryChoiceBar/categoryChoiceBar.js';

import {categoryPageTypes} from '../flux/types.js';
import categoryPageActions from '../flux/actions/categoryPageActions.js';
import store from '../flux/store.js';

// ///////////////////////////////// //
//
//          Category Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - ленту новостей, с фильтром по тегам.
 * @class CategoryPage
 */
export default class CategoryPageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    // root не трогать
    super(root);

    this.pageComponents = {
      categoryChoose: new CategoryChoiceBar(
          () => store.getState().categoryPage.currentCategory,
          categoryPageActions.selectCategory,
          categoryPageActions.clearSelectedCategory,
          categoryPageTypes.SELECT_CATEGORY,
      ),
      feed: new Feed(
          composeCards,
          'categoryPage',
          categoryPageTypes.SAVE_NEW_CATEGORY_ARTICLES,
          categoryPageTypes.CLEAR_CATEGORY_ARTICLES,
          categoryPageTypes.FORBID_CATEGORY_ARTICLES_UPLOADING,
          categoryPageTypes.ALLOW_CATEGORY_ARTICLES_UPLOADING,
          categoryPageActions.forbidCategoryArticlesLoading,
          () => {
            console.log('{CategoryPage feed} isEndFound is not been reset');
            return {type: '__EMPTY__'};
          },
      ),
    };
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();

    this.root.appendChild(createPage(
        'Поиск по категориям',
        this.pageComponents.categoryChoose,
        this.pageComponents.feed,
    ));

    this.root.querySelector('.header__title-block')
        .addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.root.querySelector(`a[name="feed-top"]`).scrollIntoView(true);
        });

    this.root.querySelector('.categories__search-block').style
        .margin = '20px 0 50px 0';

    this.root.querySelectorAll('a.header__nav-item').forEach((el) => {
      el.classList.remove('header__nav-item-active');
    });
    this.root.querySelector('a.header__nav-item[href="/categories"]')
        .classList.add('header__nav-item-active');

    const sidebarPages = this.root
        .querySelector('.sidebar__categories-mobile-only');
    sidebarPages.querySelectorAll('a.sidebar__page-item').forEach((el) => {
      el.classList.remove('sidebar__page-item-active');
    });
    sidebarPages.querySelector('a[href="/categories"]')
        .classList.add('sidebar__categories-item-active');
  }
}
