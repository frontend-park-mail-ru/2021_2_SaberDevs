import BaseComponent from '../_basic/baseComponent.js';
import ProfileCardView from './profileCardView.js';

import store from '../../flux/store.js';
import {profilePageActions} from '../../flux/actions.js';
import {profilePageTypes} from '../../flux/types.js';

const endOfFeedMarkerID = 'end';

/**
 * @class ProfileCard
 */
export default class ProfileCard extends BaseComponent {
  /**
   * Топ популярных новостей
   */
  constructor() {
    super();
    this.view = new ProfileCardView();
    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    this.unsubscribes.push(
        store.subscribe(profilePageTypes.SAVE_NEW_USER_ARTICLES,
            ({idLastLoaded, articles}) => {
              console.warn('проверить что приходит с бека: ',
                  {idLastLoaded}, {articles});
              if (Array.isArray(articles)) {
                this.view.addArticles(articles);
                if (articles[articles.length - 1]?.id === endOfFeedMarkerID) {
                  this.view.hideLoadingAnimation();

                  if (ajaxDebug) {
                    console.log('\'end\' in articles found.',
                        'doNotUpload flag is set to true');
                  }
                  // запрещаем загрузку карточек, чтобы не спамить сервер
                  store.dispatch(profilePageActions.forbidArticlesLoading());
                  // TODO: возможно, разрешить обновление
                };
              } else {
                if (ajaxDebug) {
                  console.error('API ERROR! Server must return Articles array');
                }
              }
            }),
    );
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    // TODO: user in profilepagestate
    const user = store.getState().authorization;
    const articles = store.getState().profilePage.articles;
    this.root = this.view.render(user, articles);
    return this.root;
  }
}
