import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import MainPagePreviewBar from
  '../components/mainPagePreviewBar/mainPagePreviewBar.js';

// ///////////////////////////////// //
//
//              Main Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
 * @class MainPage
 * @module MainPage
 */
export default class MainPageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    // root не трогать
    super(root);
    const feedPreview = new MainPagePreviewBar();
    this.pageComponents = {
      feedPreview,
      feed: new Feed(feedPreview),
    };
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    this.root.appendChild(createPage(this.pageComponents.feed));
  }
}
