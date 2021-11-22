import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';

import {searchTypes} from '../flux/types.js';
import searchActions from '../flux/actions/searchActions.js';
// ///////////////////////////////// //
//
//              Search Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
 * @class SearchPage
 * @module SearchPage
 */
export default class SearchPageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    // root не трогать
    super(root);
    this.pageComponents = {
      feed: new Feed(
          'search',
          searchTypes.SAVE_NEW_CARDS,
          searchTypes.CLEAR_CARDS,
          searchTypes.FORBID_CARDS_UPLOADING,
          searchTypes.ALLOW_CARDS_UPLOADING,
          searchActions.forbidCardsLoading,
          searchActions.allowCardsLoading,
      ),
    };
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    this.root.appendChild(createPage('', this.pageComponents.feed));
  }
}
