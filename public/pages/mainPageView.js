import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import composeCards from '../components/feed/composeCardStandart.js';
// import MainPagePreviewBar from
//   '../components/feed/previews/mainPagePreviewBar.js';

import {mainPageTypes} from '../flux/types.js';
import {mainPageActions} from '../flux/actions.js';
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
    this.pageComponents = {
      feed: new Feed(
          composeCards,
          'mainPage',
          mainPageTypes.SAVE_NEW_CARDS,
          mainPageTypes.CLEAR_CARDS,
          mainPageTypes.FORBID_CARDS_UPLOADING,
          mainPageTypes.ALLOW_CARDS_UPLOADING,
          mainPageActions.forbidCardsLoading,
          mainPageActions.allowCardsLoading,
          mainPageActions.like,
      ),
    };
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    this.root.appendChild(createPage('', this.pageComponents.feed));
    this.root.querySelectorAll('a.header__nav-item').forEach((el) => {
      el.classList.remove('header__nav-item-active');
    });
    this.root.querySelector('a.header__nav-item[href="/"]')
        .classList.add('header__nav-item-active');

    const sidebarPages = this.root
        .querySelector('.sidebar__categories-mobile-only');
    sidebarPages.querySelectorAll('a.sidebar__page-item').forEach((el) => {
      el.classList.remove('sidebar__page-item-active');
    });
    sidebarPages.querySelector('a[href="/"]')
        .classList.add('sidebar__categories-item-active');

    this.root.querySelector('.header__title-block')
        .addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.root.querySelector(`a[name="feed-top"]`).scrollIntoView(true);
        });
  }
}
