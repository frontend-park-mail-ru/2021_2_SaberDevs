import BaseComponentView from '../../_basic/baseComponentView.js';
/**
 * @class searchBarView
 */
export default class searchBarView extends BaseComponentView {
  /**
    * @return {HTMLElement}
    */
  render() {
    const search = document.createElement('div');
    search.className = 'search-page';
    search.innerHTML = `
      <div class="search-page__search-bar">
        <div data-inplace="place-for-search"></div>
      </div>
      <div class="search-page__message" style="display: none;"></div>
    `;
    return search;
  }
}
