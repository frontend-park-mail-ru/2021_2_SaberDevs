import BaseComponentView from '../_basic/baseComponentView';
import likesComponent from './likes.pug.js';

import {KeyElementsMap, IKeyElementsMap} from '../_basic/baseComponentView';
import {Rate} from '../../common/types';

export enum RatableInstances {
  article,
  comment,
}

interface IKeyElementsMapLikes extends IKeyElementsMap {
  dislikeBtn: HTMLButtonElement;
}

export type KeyElementsMapLikes = KeyElementsMap<IKeyElementsMapLikes>;

/**
 * @class LikesView
 */
export default class LikesView extends BaseComponentView {
  keyElems: KeyElementsMapLikes;

  /**
   * @param {number} likes
   * @param {number} liked
   * @return {HTMLElement}
   */
  render(likes: number, liked: Rate): HTMLElement {
    const likesWrapper = document.createElement('div');
    likesWrapper.innerHTML = <string> likesComponent({likes, liked});
    const likesBar = <HTMLDivElement> likesWrapper.firstElementChild;

    const likesNum = <HTMLDivElement> likesBar.querySelector('#likesNum');
    const dislikeBtn = <HTMLButtonElement> likesBar.querySelector('.action-btns__dislike-icon');
    const likeBtn = <HTMLButtonElement> likesBar.querySelector('.action-btns__likes-icon');

    if (!(likesNum && dislikeBtn && likeBtn)) {
      console.warn(
        '{Likes} component template contains an error',
      );
      return document.createElement('div');
    }

    this.keyElems = {
      likesNum,
      likeBtn,
      dislikeBtn,
    };

    return likesBar;
  }
}
