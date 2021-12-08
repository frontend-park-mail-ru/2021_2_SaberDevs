import BaseComponent from '../_basic/baseComponent.js';
import CategoryChoiceBarView from './categoryChoiceBarView.js';

import store from '../../flux/store.js';

import categoriesList from '../../common/categoriesList.js';

/**
 * ViewModel-компонент соответсвующего View
 * @class CatergoryChooseBar
 */
export default class CategoryChoiceBar extends BaseComponent {
  /**
   * Универсальный компонент заголовка для страницы с категориями
   * @param {Action<string>} getCurrentSelection
   * @param {Action<string>} setSelection
   * @param {Action} clearSelection
   * @param {Type} SELECT_CATEGORY_TYPE
   */
  constructor(getCurrentSelection, setSelection,
      clearSelection, SELECT_CATEGORY_TYPE,
  ) {
    super();
    this.view = new CategoryChoiceBarView();
    this.setSelection = setSelection;
    this.clearSelection = clearSelection;
    this.getCurrentSelection = getCurrentSelection;

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    this.unsubscribes.push(
        // Выделить выбранную категорию
        store.subscribe(SELECT_CATEGORY_TYPE, (category) => {
          this.markSelectedCategory(category);
        }),
    );
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render(categoriesList);
    const categoriesBox = this.root.querySelector('div.categories__row');

    this.root.querySelectorAll('div.category').forEach(
        (category) => {
          category.addEventListener('click', ({target}) => {
            const choosenCategory = this.getCurrentSelection();
            if (target.textContent === choosenCategory) {
              store.dispatch(this.clearSelection());
            } else {
              store.dispatch(this.setSelection(target.textContent));
            }
          });
        });

    this.markSelectedCategory(this.getCurrentSelection());

    // Выводятся нужные теги при вводе в поисковую строку (поиск)
    const showMatch = (elem, pos, len) => elem.slice(0, pos) +
        '<span class="categories__mark">' + elem.slice(pos, pos + len) +
        '</span>' + elem.slice(pos + len);

    this.root.querySelector('input.categories__search-input')
        .oninput = (e) => {
          const value = e.target.value.trim().toLocaleLowerCase();
          if (value != '') {
            categoriesBox.childNodes.forEach((content) => {
              const elem = content.lastChild;
              const pos = elem.textContent.toLocaleLowerCase().indexOf(value);
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

  /**
   * пройтись по всем сущностям и выделить выбранный
   * @param {string} currentCategory
   */
  markSelectedCategory(currentCategory) {
    const categoriesBox = this.root.querySelector('div.categories__row');
    if (!categoriesBox) {
      console.warn('{CategoryChoiceBar} component hasn\'t been rendered yet');
      return;
    }
    categoriesBox.childNodes.forEach((categoryDiv) => {
      categoryDiv.style.borderColor = 'transparent';
      categoryDiv.onmouseout = ({currentTarget}) => {
        currentTarget.style.borderColor = 'transparent';
      };
      if (categoryDiv.textContent === currentCategory) {
        categoryDiv.style.borderColor = categoryDiv.firstChild.style.color;
        categoryDiv.onmouseout = undefined;
      }
    });
  }
}
