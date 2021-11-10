import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import MainPagePreviewBar from
  '../components/feed/previews/mainPagePreviewBar.js';

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
    const feedPreview = new MainPagePreviewBar();
    this.pageComponents = {
      feedPreview,
      feed: new Feed(
          'mainPage',
          mainPageTypes.SAVE_NEW_CARDS,
          mainPageTypes.CLEAR_CARDS,
          mainPageTypes.FORBID_CARDS_UPLOADING,
          mainPageTypes.ALLOW_CARDS_UPLOADING,
          mainPageActions.forbidCardsLoading,
          mainPageActions.allowCardsLoading,
          feedPreview,
      ),
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
