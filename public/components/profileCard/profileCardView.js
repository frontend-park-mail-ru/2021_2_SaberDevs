import BaseComponentView from '../_basic/baseComponentView.js';
import profileCardComponent from './profileCard.pug.js';

/**
 * @class profileCard
 */
export default class profileCardView extends BaseComponentView {
  /**
  * Хранит состояние - загруженные статьи автора
  * @param {string} preview
  */
  constructor() {
    super();
    this.root = document.createElement('div');
    this.root.innerHTML = 'компонент profileCard';
  }

  /**
   * @param {Object} user
   * @property {string} login
   * @property {string?} firstName
   * @property {string?} lastName
   * @property {string?} avatarUrl
   * @property {number?} score
   * @return {HTMLElement}
   */
  render(user) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = profileCardComponent({
      ...user,
    });
    this.root = wrapper.firstChild;
    return wrapper.firstChild;
  }
}
