import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import composeUsers from '../components/feed/composeUsers.js';
import SearchBar from '../components/feed/previews/searchBar.js';

import {SearchTypes} from '../flux/types';
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
      searchBar: new SearchBar(),
      feed: new Feed(
          composeUsers,
          'search',
          SearchTypes.SAVE_NEW_CARDS,
          SearchTypes.CLEAR_CARDS,
          SearchTypes.FORBID_CARDS_UPLOADING,
          SearchTypes.ALLOW_CARDS_UPLOADING,
          searchActions.forbidCardsLoading,
          () => {
            console.log('{SearchPage feed} isEndFound is not been reset');
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
        'Поиск',
        this.pageComponents.searchBar,
        this.pageComponents.feed,
    ));

    // this.root.querySelector('.header__title-block')
    //     .addEventListener('click', (e) => {
    //       e.preventDefault();
    //       e.stopPropagation();
    //       this.root.querySelector(`a[name="feed-top"]`).scrollIntoView(true);
    //     });
  }
}
