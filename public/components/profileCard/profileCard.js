import BaseComponent from '../_basic/baseComponent.js';
import ProfileCardView from './profileCardView.js';

import store from '../../flux/store.js';

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
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    // TODO: user in profilepagestate
    const user = store.getState().authorization;
    this.root = this.view.render(user);
    return this.root;
  }
}
