import BaseComponent from '../_basic/baseComponent.js';
import CatergoryChoiceBarView from './categoryChoiceBarView.js';

import store from '../../flux/store.js';
import categoryPageActions from '../../flux/actions/categoryPageActions.js';
/**
 * ViewModel-компонент соответсвующего View
 * @class CatergoryChooseBar
 */
export default class CatergoryChoiceBar extends BaseComponent {
  /**
   * Универсальный компонент заголовка для страницы с категориями
   */
  constructor() {
    super();
    this.view = new CatergoryChoiceBarView();
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();

    const categorysListDiv = this.root;
    categorysListDiv.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.target;
      const choosenCategory = store.getState().categoryPage.currentCategory;
      if (target.innerHTML === choosenCategory) {
        store.dispatch(categoryPageActions.clearSelectedCategory());
      } else {
        store.dispatch(categoryPageActions.selectCategory(target.innerHTML));
      }
      console.log('{CatergoryChooseBar} selecting category:',
          store.getState().categoryPage.currentCategory);
      target.parentElement.childNodes.forEach((categoryDiv) => {
        categoryDiv.classList.remove('categories__tag_choosen');
        if (categoryDiv.innerHTML ===
              store.getState().categoryPage.currentCategory) {
          categoryDiv.classList.add('categories__tag_choosen');
        }
      });
    });

    return this.root;
  }
}
