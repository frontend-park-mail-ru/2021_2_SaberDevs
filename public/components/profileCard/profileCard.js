import BaseComponent from '../_basic/baseComponent.js';
import ProfileCardView from './profileCardView.js';

import store from '../../flux/store.js';
import {profilePageTypes} from '../../flux/types.js';

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
        store.subscribe(profilePageTypes.SET_USER_LOADING, (user) => {
          this.setUser(user);
        }),
        store.subscribe(profilePageTypes.SET_USER_INFO, (user) => {
          this.setUser(user);
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
    const user = store.getState().profilePage.user;
    this.root = this.view.render(user);
    return this.root;
  }

  /**
   * @param {Object} user
   * @property {string} login
   * @property {string?} firstName
   * @property {string?} lastName
   * @property {email?} email
   * @property {string?} avatarUrl
   * @property {number?} score
   */
  setUser(user) {
    this.root = this.view.render(user);
  }
}
