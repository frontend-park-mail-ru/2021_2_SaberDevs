import BaseComponentView from '../_basic/baseComponentView';
import profileCardComponent from './profileCard.pug.js';

import {User} from '../../common/types';
import {KeyElementsMap, IKeyElementsMap} from '../_basic/baseComponentView';

interface IKeyElementsMapProfile extends IKeyElementsMap {
  userDescInfo: HTMLDivElement;
  btnSettings: HTMLDivElement;
}

export type KeyElementsMapProfile = KeyElementsMap<IKeyElementsMapProfile>;


/**
 * @class profileCard
 */
export default class profileCardView extends BaseComponentView {
  keyElems: KeyElementsMapProfile;

  /**
   * @param {User} user
   * @return {HTMLElement}
   */
  render(user: User): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = <string> profileCardComponent(user);
    const profile = <HTMLElement> wrapper.firstElementChild;
    
    const btnSettings = <HTMLDivElement> profile.querySelector('#to-profile-settings');
    const userDescInfo = <HTMLDivElement> profile.querySelector('.profile__aboutme');
    if (!(btnSettings && userDescInfo)) {
      console.warn(
        '{Profile} component template contains an error',
      );
      return document.createElement('div');
    }
    this.keyElems = {
      btnSettings,
      userDescInfo,
    };
    return profile;
  }
}
