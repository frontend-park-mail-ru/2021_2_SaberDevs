import BaseComponentView from '../_basic/baseComponentView';
import categoryChoiceBarComponent from './categoryChoiceBar.pug.js';
import {genRanHexColor} from '../../common/utils.js';
import {KeyElementsMap, IKeyElementsMap} from '../_basic/baseComponentView';

interface IKeyElementsMapCategoryChoiceBar extends IKeyElementsMap {
  categoriesBox: HTMLDivElement;
  input: HTMLInputElement;
}

export type KeyElementsMapCategoryChoiceBar = KeyElementsMap<IKeyElementsMapCategoryChoiceBar>;

/**
 * @class CatergoryChooseBarView
 */
export default class CategoryChoiceBarView extends BaseComponentView {
  keyElems: KeyElementsMapCategoryChoiceBar;

  /**
   * @param {Array<string>} categories
   * @return {HTMLElement}
   */
  render(categories: string[]): HTMLElement {
    const barDiv = document.createElement('div');
    barDiv.innerHTML = <string> categoryChoiceBarComponent({
      categories: categories.map((c)=>({content: c, color: genRanHexColor(c)})),
    });

    const root = <HTMLElement> barDiv.firstElementChild;

    const categoriesBox = <HTMLDivElement> root.querySelector('div.categories__row');
    const input = <HTMLInputElement> root.querySelector('input.categories__search-input');
    if (!(categoriesBox && input)) {
      console.warn(
        '{CategoryChoiceBar} component template contains an error',
      );
      return document.createElement('div');
    }

    this.keyElems = {
      categoriesBox,
      input,
    }

    return root;
  }
}
