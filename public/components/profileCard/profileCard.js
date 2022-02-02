import BaseComponent from '../_basic/baseComponent.js';
import ProfileCardView from './profileCardView.js';

import store from '../../flux/store.js';
import {ProfilePageTypes} from '../../flux/types';
import {redirect} from '../../common/utils.js';

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
        store.subscribe(ProfilePageTypes.SET_USER_LOADING, (user) => {
          this.setUser(user);
        }),
        store.subscribe(ProfilePageTypes.SET_USER_INFO, (user) => {
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
    const user = store.getState().profilePage.user;
    this.root = document.createElement('div');
    this.root.className = 'profile';
    this.root.appendChild(this.view.render(user));
    addEventListeners(this.root.firstChild, user);
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
    this.root.innerHTML = '';
    const newCard = this.view.render(user);
    addEventListeners(newCard, user);
    this.root.appendChild(newCard);
  }
}

const addEventListeners = (root, user) => {
  const auth = store.getState().authorization;
  if (user.login === auth.login) {
    // вкл кнопку настроек
    const btn = root.querySelector('#to-profile-settings');
    btn.style.display = 'flex';
    btn.addEventListener('click', (e) => {
      redirect('/profile/settings');
    });

    if (!user.description || user.description === '') {
      root.querySelector('.profile__aboutme')
          .innerHTML = 'Поделитесь информацией о себе в настройках';
    }
  }
};
