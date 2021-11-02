import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import CategoryChooseBar from
  '../components/feed/previews/catergoryChooseBar.js';

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
      categoryChoose: new CategoryChooseBar(),
      feed: new Feed(
          'categoryPage',
          categoryPageTypes.SAVE_NEW_CATEGORY_ARTICLES,
          categoryPageActions.forbidCategoryArticlesLoading,
          categoryPageActions.allowCategoryArticlesLoading,
      ),
    };
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    const sign = document.createElement('p');
    sign.innerHTML = 'Выберите тег';
    sign.style.color = 'white';
    sign.style.fontSize = '2rem';
    this.root.appendChild(createPage(
        sign,
        this.pageComponents.categoryChoose,
        this.pageComponents.feed,
    ));
  }
}
