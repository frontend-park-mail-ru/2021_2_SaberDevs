import BaseComponentView from '../_basic/baseComponentView.js';
import categoryChoiceBarComponent from './categoryChoiceBar.pug.js';
import {genRanHexColor} from '../../../common/utils.js';

/**
 * @class CatergoryChooseBarView
 */
export default class CategoryChoiceBarView extends BaseComponentView {
  /**
   * @param {Array<string>} categories
   * @return {HTMLElement}
   */
  render(categories) {
    const barDiv = document.createElement('div');
    barDiv.innerHTML = categoryChoiceBarComponent({
      categories: categories.map((c)=>({content: c, color: genRanHexColor()})),
    });
    // barDiv.className = 'tags';
    // categories.forEach((tag) => {
    //   const tagContentDiv = document.createElement('div');
    //   tagContentDiv.className = 'tags__tag-content';
    //   tagContentDiv.style.backgroundColor =  genRanHexColor();
    //   const tagDiv = document.createElement('div');
    //   tagDiv.className = 'tags__tag';
    //   // tagDiv.classList.add('categories__tag');
    //   tagDiv.innerHTML = tag;
    //   tagContentDiv.appendChild(tagDiv);
    //   barDiv.appendChild(tagContentDiv);
    // });
    return barDiv.firstChild;
  }
}
