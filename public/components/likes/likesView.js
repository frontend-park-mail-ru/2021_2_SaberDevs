import BaseComponentView from '../_basic/baseComponentView.js';
import likesComponent from './likes.pug.js';

/**
 * @class LikesView
 */
export default class LikesView extends BaseComponentView {
  /**
   * @param {number} likes
   * @param {number} liked
   * @return {HTMLElement}
   */
  render(likes, liked) {
    const likesWrapper= document.createElement('div');
    likesWrapper.innerHTML = likesComponent({likes, liked});
    return likesWrapper.firstChild;
  }
}
