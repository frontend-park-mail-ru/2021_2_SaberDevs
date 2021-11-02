import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import CategoryChooseBar from
  '../components/feed/previews/catergoryChooseBar.js';

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
    const categoryChoose = new CategoryChooseBar();
    this.pageComponents = {
      categoryChoose,
      feed: new Feed(),
    };
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    this.root.appendChild(createPage(this.pageComponents.categoryChoose,
        this.pageComponents.feed));
  }
}

