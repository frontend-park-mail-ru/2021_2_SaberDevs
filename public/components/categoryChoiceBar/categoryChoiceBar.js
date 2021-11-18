import BaseComponent from '../_basic/baseComponent.js';
import CategoryChoiceBarView from './categoryChoiceBarView.js';

import store from '../../flux/store.js';
import categoryPageActions from '../../flux/actions/categoryPageActions.js';

const categoriesList = [
  'personal',
  'marketing',
  'finance',
  'design',
  'career',
  'technical',
];

/**
 * ViewModel-компонент соответсвующего View
 * @class CatergoryChooseBar
 */
export default class CategoryChoiceBar extends BaseComponent {
  /**
   * Универсальный компонент заголовка для страницы с категориями
   */
  constructor() {
    super();
    this.view = new CategoryChoiceBarView();
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render(categoriesList);
    const categoriesBox = this.root.querySelector('div.tags');

    this.root.querySelectorAll('div.tags__tag-content').forEach((category) => {
      category.addEventListener('click', ({target}) => {
        const choosenCategory = store.getState().categoryPage.currentCategory;
        if (target.innerHTML === choosenCategory) {
          store.dispatch(categoryPageActions.clearSelectedCategory());
        } else {
          store.dispatch(categoryPageActions.selectCategory(target.innerHTML));
        }
        categoriesBox.childNodes.forEach((categoryDiv) => {
          categoryDiv.classList.remove('categories__choosen');
          if (categoryDiv.innerText ===
                store.getState().categoryPage.currentCategory) {
            categoryDiv.classList.add('categories__choosen');
          }
        });
      });
      if (category.textContent.trim() ===
        store.getState().categoryPage.currentCategory) {
        category.classList.add('categories__choosen');
      }
    });

    // Выводятся нужные теги при вводе в поисковую строку (поиск)
    const showMatch = (elem, pos, len) => elem.slice(0, pos) +
        '<span class="categories__mark">' + elem.slice(pos, pos + len) +
        '</span>' + elem.slice(pos + len);

    this.root.querySelector('input.categories__search-input')
        .oninput = (e) => {
          const value = e.target.value;
          if (value != '') {
            categoriesBox.childNodes.forEach((content) => {
              const elem = content.lastChild;
              const pos = elem.textContent.indexOf(value);
              if (pos == -1) {
                elem.parentElement.style.display = 'none';
                elem.innerHTML = elem.textContent;
              } else {
                elem.parentElement.style.display = '';
                elem.innerHTML = showMatch(elem.textContent, pos, value.length);
              }
            });
          } else {
            categoriesBox.childNodes.forEach((content) => {
              const elem = content.lastChild;
              elem.parentElement.style.display = '';
              elem.innerHTML = elem.textContent;
            });
          }
        };

    return this.root;
  }
}
