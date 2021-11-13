import BaseComponentView from '../_basic/baseComponentView.js';

import {genRanHex} from '../../../common/utils.js';

const tags = [
  'personal',
  'marketing',
  'finance',
  'design',
  'career',
  'technical',
];

const tagCSS = () => `
color: white;
background-color: #${genRanHex()};
display: flex;
margin: 10px;
padding: 3px;
box-sizing: border-box;
border-radius: 5px;
`;

/**
 * @class CatergoryChooseBarView
 */
export default class TagChoiceBarView extends BaseComponentView {
  /**
    * @return {HTMLElement}
    */
  render() {
    const barDiv = document.createElement('div');
    barDiv.style.flexDirection = 'row';
    barDiv.style.width = '100%';
    barDiv.style.display = 'flex';
    barDiv.style.padding = '2px';
    barDiv.style.backgroundColor = 'transparent';
    tags.forEach((tag) => {
      const tagDiv = document.createElement('div');
      tagDiv.innerHTML = tag;
      tagDiv.style.cssText = tagCSS();
      barDiv.appendChild(tagDiv);
    });
    return barDiv;
  }
}
