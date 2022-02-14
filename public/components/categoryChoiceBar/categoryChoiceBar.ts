import BaseComponent from '../_basic/baseComponent';
import CategoryChoiceBarView from './categoryChoiceBarView';

import store from '../../flux/store';

import categoriesList from '../../common/categoriesList';

import {FluxActionType} from '../../flux/types';
import {KeyElementsMapCategoryChoiceBar} from './categoryChoiceBarView';

/**
 * ViewModel-компонент соответсвующего View
 * @class CatergoryChooseBar
 */
export default class CategoryChoiceBar extends BaseComponent {
  view: CategoryChoiceBarView;
  setSelection: (category: string) => void;
  clearSelection: () => void;
  getCurrentSelection: () => string;
  
  /**
   * Универсальный компонент заголовка для страницы с категориями
   * @param {Function} getCurrentSelection
   * @param {Function<string>} setSelection
   * @param {Function} clearSelection
   * @param {FluxActionType} SELECT_CATEGORY_TYPE
   */
  constructor(
      getCurrentSelection: () => string,
      setSelection: (category: string) => void,
      clearSelection: () => void,
      SELECT_CATEGORY_TYPE: FluxActionType,
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
        store.subscribe(SELECT_CATEGORY_TYPE, (category: string) => {
          this.markSelectedCategory(category);
        }),
    );
  }

  get keyElems(): KeyElementsMapCategoryChoiceBar {
    return this.view.keyElems;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();
  
    this.root = this.view.render(categoriesList);
    if (!this.keyElems) {
      return this.root;
    }

    (<NodeListOf<HTMLDivElement>>this.root.querySelectorAll('div.category')).forEach(
        (category) => {
          category.addEventListener('click', (e: Event) => {
            const target = <HTMLElement> e.target;
            const choosenCategory: string = this.getCurrentSelection();
            if (target.textContent === choosenCategory) {
              store.dispatch(this.clearSelection());
            } else {
              store.dispatch(this.setSelection(target.textContent));
            }
          });
        });

    this.markSelectedCategory(this.getCurrentSelection());

    // Выводятся нужные теги при вводе в поисковую строку (поиск)
    const showMatch = (elem: string, pos: number, len: number) => elem.slice(0, pos) +
        '<span class="categories__mark">' + elem.slice(pos, pos + len) +
        '</span>' + elem.slice(pos + len);

    this.keyElems.input.oninput = (e: InputEvent) => {
      const value = (<HTMLInputElement>e.target).value.trim().toLocaleLowerCase();
      if (value !== '') {
        this.keyElems.categoriesBox.childNodes.forEach((content: HTMLElement) => {
          const elem = <HTMLElement>content.lastChild;
          const pos: number = elem.textContent.toLocaleLowerCase().indexOf(value);
          if (pos == -1) {
            elem.parentElement.style.display = 'none';
            elem.innerHTML = elem.textContent;
          } else {
            elem.parentElement.style.display = '';
            elem.innerHTML = showMatch(elem.textContent, pos, value.length);
          }
        });
      } else {
        this.keyElems.categoriesBox.childNodes.forEach((content) => {
          const elem = <HTMLElement>content.lastChild;
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
  markSelectedCategory(currentCategory: string) {
    if (!this.keyElems) {
      console.warn('{CategoryChoiceBar} component hasn\'t been rendered yet');
      return;
    }
    this.keyElems.categoriesBox.childNodes.forEach((categoryDiv: HTMLDivElement) => {
      categoryDiv.style.borderColor = 'transparent';
      categoryDiv.onmouseout = ({currentTarget} : Event) => {
        (<HTMLDivElement>currentTarget).style.borderColor = 'transparent';
      };
      if (categoryDiv.textContent === currentCategory) {
        categoryDiv.style.borderColor = (<HTMLDivElement>categoryDiv.firstChild).style.color;
        categoryDiv.onmouseout = undefined;
      }
    });
  }
}
