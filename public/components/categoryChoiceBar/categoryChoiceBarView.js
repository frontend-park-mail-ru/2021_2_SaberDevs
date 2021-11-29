import BaseComponentView from '../_basic/baseComponentView.js';
import categoryChoiceBarComponent from './categoryChoiceBar.pug.js';
import {genRanHexColor} from '../../common/utils.js';

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
    return barDiv.firstChild;
  }
}
