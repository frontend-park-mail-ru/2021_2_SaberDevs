import BasePageView from './basePageView';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed';
import composeCards from '../components/feed/composeCardStandart';
import ProfileCard from '../components/profileCard/profileCard';

import {ProfilePageTypes} from '../flux/types';
import profilePageActions from '../flux/actions/profilePageActions';

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
          ProfilePageTypes.SAVE_NEW_USER_ARTICLES,
          ProfilePageTypes.CLEAR_USER_ARTICLES,
          ProfilePageTypes.FORBID_USER_ARTICLES_UPLOADING,
          ProfilePageTypes.ALLOW_USER_ARTICLES_UPLOADING,
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

    // this.root.querySelector('.header__title-block')
    //     .addEventListener('click', (e/*: Event*/) => {
    //       e.preventDefault();
    //       e.stopPropagation();
    //       this.root.querySelector(`a[name="feed-top"]`).scrollIntoView(true);
    //     });
  }
}
