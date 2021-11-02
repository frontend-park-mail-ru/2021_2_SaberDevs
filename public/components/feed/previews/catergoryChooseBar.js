import BaseComponent from '../../_basic/baseComponent.js';
import CatergoryChooseBarView from './catergoryChooseBarView.js';

import store from '../../../flux/store.js';
import {categoryPageActions} from '../../../flux/actions.js';
/**
 * ViewModel-компонент соответсвующего View
 * @class CatergoryChooseBar
 */
export default class CatergoryChooseBar extends BaseComponent {
  /**
   * Универсальный компонент заголовка для страницы с категориями
   */
  constructor() {
    super();
    this.view = new CatergoryChooseBarView();
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();
    // const tags = this.root.firstChild.querySelectorAll('div');
    // if (tags.length === 0) {
    //   console.warn('problem with tags');
    // }
    // tags.forEach((tagDiv) => {
    //   tagDiv.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     const tar
    //     const choosenTag = store.getState().categoryPage.choosenTag;
    //     if (e.target.in)
    //     e.target.style.border = '1px solid white';
    //   });
    // });
    const tagsListDiv = this.root.firstChild;
    tagsListDiv.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.target;
      const choosenTag = store.getState().categoryPage.choosenTag;
      if (target.innerHTML === choosenTag) {
        store.dispatch(categoryPageActions.clearSelectedCategoryTags());
      } else {
        store.dispatch(categoryPageActions.selectCategoryTag(target.innerHTML));
      }
      console.warn('selecting choosen tag (',
          store.getState().categoryPage.choosenTag, ')');
      console.warn({target});
      console.warn(e.currentTarget);
      e.currentTarget.childNodes.forEach((tagDiv) => {
        if (tagDiv.innerHTML === store.getState().categoryPage.choosenTag) {
          tagDiv.style.border = '1px solid white';
        }
      });
    });

    return this.root;
  }
}
