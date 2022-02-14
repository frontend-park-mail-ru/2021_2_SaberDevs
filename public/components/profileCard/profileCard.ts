import BaseComponent from '../_basic/baseComponent';
import ProfileCardView from './profileCardView';

import store from '../../flux/store';
import {ProfilePageTypes} from '../../flux/types';
import {redirect} from '../../common/utils.js';

import {KeyElementsMapProfile} from './ProfileCardView';
import {AuthorizationStateObject} from '../../flux/reducers/authorizeReducer';
import {User} from '../../common/types';

/**
 * @class ProfileCard
 */
export default class ProfileCard extends BaseComponent {
  view: ProfileCardView;
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

  get keyElems(): KeyElementsMapProfile {
    return this.view.keyElems;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();
    this.root = document.createElement('div');
    this.root.className = 'profile';

    const user: User = store.getState().profilePage.user;
    
    const userBar: HTMLElement = this.view.render(user);
    this.root.appendChild(userBar);

    if (!this.keyElems) {
      return document.createElement('div');
    }

    addEventListeners(this.keyElems.btnSettings, this.keyElems.userDescInfo, user);

    return this.root;
  }

  /**
   * @param {User} user
   */
  setUser(user: User) {
    this.root.innerHTML = '';
    const newCard: HTMLElement = this.view.render(user);
    addEventListeners(this.keyElems.btnSettings, this.keyElems.userDescInfo, user);
    this.root.appendChild(newCard);
  }
}

/**
 * 
 * @param {HTMLElement} btnSettings
 * @param {HTMLElement} userDescInfo
 * @param {Author} user 
 */
const addEventListeners = (btnSettings: HTMLElement, userDescInfo: HTMLElement, user: User) => {
  const auth: AuthorizationStateObject = store.getState().authorization;
  if (user.login === auth.login) {
    // вкл кнопку настроек // TODO: на button
    btnSettings.style.display = 'flex';
    btnSettings.addEventListener('click', (e: Event) => {
      redirect('/profile/settings');
    });

    if (!user.description) {
      userDescInfo.innerHTML = 'Поделитесь информацией о себе в настройках';
    }
  }
};
