import BasePageView from './basePageView.js';
import Header from '../components/header/header.js';
import Sidebar from '../components/sidebar/sidebar.js';
import Feed from '../components/feed/feed.js';

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
    super(root);
    this.pageComponents = {
      header: new Header(),
      sidebar: new Sidebar(),
      feed: new Feed(),
    };
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    if (viewsDebug) {
      console.log('MainPageView render');
    }
    const root = this.root;

    root.innerHTML = '';
    root.appendChild(this.pageComponents.header.render());

    const mainContainer = document.createElement('main');
    mainContainer.className = 'container';
    mainContainer.appendChild(this.pageComponents.sidebar.render());
    mainContainer.appendChild(this.pageComponents.feed.render());

    root.appendChild(mainContainer);
  }
}
