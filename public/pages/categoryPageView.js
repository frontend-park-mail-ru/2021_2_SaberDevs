import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import TagChoiceBar from
  '../components/tagChoiceBar/tagChoiceBar.js';
import categoriesComponent from '../components/categories/categories.pug.js';

import {categoryPageTypes} from '../flux/types.js';
import {categoryPageActions} from '../flux/actions.js';

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
      categoryChoose: new TagChoiceBar(),
      feed: new Feed(
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
    const categoriesPage = document.createElement('div');
    categoriesPage.outerHTML = categoriesComponent({});
    this.root.appendChild(createPage(
        categoriesPage,
        this.pageComponents.categoryChoose,
        this.pageComponents.feed,
    ));
  }
}
