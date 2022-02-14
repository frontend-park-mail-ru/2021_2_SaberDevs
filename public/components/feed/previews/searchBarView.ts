import BaseComponentView from '../../_basic/baseComponentView';
import {KeyElementsMap, IKeyElementsMap} from '../../_basic/baseComponentView';

interface IKeyElementsMapSearchBar extends IKeyElementsMap {
  messageDiv: HTMLDivElement;
}

export type KeyElementsMapSearchBar = KeyElementsMap<IKeyElementsMapSearchBar>;

/**
 * @class SearchBarView
 */
export default class SearchBarView extends BaseComponentView {
  keyElems: KeyElementsMapSearchBar;

  /**
    * @return {HTMLElement}
    */
  render(): HTMLElement {
    const search = document.createElement('div');
    search.className = 'search-page';
    search.innerHTML = `
      <div class="search-page__search-bar">
        <div data-inplace="place-for-search"></div>
      </div>
      <div class="search-page__message" style="display: none;"></div>
    `;
    if (!(true)) {
      console.warn(
        '{SearchBar} component template contains an error',
      );
      return document.createElement('div');
    }

    const messageDiv = <HTMLDivElement> search.querySelector('.search-page__message');

    this.keyElems = {
      messageDiv,
    };
    return search;
  }
}
