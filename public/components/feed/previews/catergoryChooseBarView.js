import BaseComponentView from '../../_basic/baseComponentView.js';

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
export default class CatergoryChooseBarView extends BaseComponentView {
  /**
    * @return {HTMLElement}
    */
  render() {
    const barDiv = document.createElement('div');
    barDiv.style.flexDirection = 'row';
    barDiv.style.width = '100%';
    barDiv.style.display = 'flex';
    tags.forEach((tag) => {
      const tagDiv = document.createElement('div');
      tagDiv.innerHTML = tag;
      tagDiv.style.cssText = `
        color: white;
        background-color: #${genRanHex()};
        display: flex;
        margin: 1px, 2px;
        box-sizing: border-box;
        border-radius: 5px;
      `;
      barDiv.appendChild(tagDiv);
    });
    return barDiv;
  }
}
