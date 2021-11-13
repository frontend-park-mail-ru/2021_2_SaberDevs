import BaseComponent from '../_basic/baseComponent.js';
import TagChoiceBarView from './tagChoiceBarView.js';

import store from '../../flux/store.js';
import {categoryPageActions} from '../../flux/actions.js';
/**
 * ViewModel-компонент соответсвующего View
 * @class CatergoryChooseBar
 */
export default class TagChoiceBar extends BaseComponent {
  /**
   * Универсальный компонент заголовка для страницы с категориями
   */
  constructor() {
    super();
    this.view = new TagChoiceBarView();
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();

    const tagsListDiv = this.root;
    console.warn({tagsListDiv});
    tagsListDiv.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.target;
      const choosenTag = store.getState().categoryPage.choosenTag;
      if (target.innerHTML === choosenTag) {
        store.dispatch(categoryPageActions.clearSelectedCategoryTags());
      } else {
        store.dispatch(categoryPageActions.selectCategoryTag(target.innerHTML));
      }
      console.log('{CatergoryChooseBar} selecting choosen tag (',
          store.getState().categoryPage.choosenTag, ')');
      target.parentElement.childNodes.forEach((tagDiv) => {
        tagDiv.classList.remove('categories__tag_choosen');
        if (tagDiv.innerHTML === store.getState().categoryPage.choosenTag) {
          tagDiv.classList.add('categories__tag_choosen');
        }
      });
    });

    return this.root;
  }
}
