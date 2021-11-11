import BaseComponentView from '../_basic/baseComponentView.js';

import {genRanHex} from '../../../utils.js';

const tags = [
  'personal',
  'marketing',
  'finance',
  'design',
  'career',
  'technical',
];

/**
 * @class CatergoryChooseBarView
 */
export default class TagChoiceBarView extends BaseComponentView {
  /**
    * @return {HTMLElement}
    */
  render() {
    const barDiv = document.createElement('div');
    barDiv.className = 'categories__choose-bar';
    tags.forEach((tag) => {
      const tagDiv = document.createElement('div');
      tagDiv.className = 'tags__tag';
      tagDiv.classList.add('categories__tag');
      tagDiv.innerHTML = tag;
      tagDiv.style.backgroundColor = '#' + genRanHex();
      barDiv.appendChild(tagDiv);
    });
    return barDiv;
  }
}
