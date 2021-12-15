import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import composeCards from '../components/feed/composeCardStandart.js';
import ProfileCard from '../components/profileCard/profileCard.js';

import {profilePageTypes} from '../flux/types.js';
import profilePageActions from '../flux/actions/profilePageActions.js';

/**
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
 * @class ProfilePageView
 */
export default class ProfilePageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.pageComponents = {
      profileCard: new ProfileCard(),
      feed: new Feed(
          composeCards,
          'profilePage',
          profilePageTypes.SAVE_NEW_USER_ARTICLES,
          profilePageTypes.CLEAR_USER_ARTICLES,
          profilePageTypes.FORBID_USER_ARTICLES_UPLOADING,
          profilePageTypes.ALLOW_USER_ARTICLES_UPLOADING,
          profilePageActions.forbidArticlesLoading,
          () => {
            console.log('{profilePage feed} isEndFound is not been reset');
            return {type: '__EMPTY__'};
          },
      ),
    };
  }

  /**
   * Страница содержит главный компонент - карточку пользователя и его статьи
   */
  render() {
    super.render();
    this.root.appendChild(createPage(
        '',
        this.pageComponents.profileCard,
        this.pageComponents.feed,
    ));
  }
}
