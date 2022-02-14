import BaseComponentView from '../_basic/baseComponentView';
import SearchRowComponent from './SearchRow.pug.js';

import {KeyElementsMap, IKeyElementsMap} from '../_basic/baseComponentView';

interface IKeyElementsMapSearchRow extends IKeyElementsMap {
  searchBtn: HTMLButtonElement;
  searchInput: HTMLInputElement;
  SearchRow: HTMLDivElement;
  groupOptions: HTMLDivElement;
  groupBar: HTMLInputElement;
  groupDropDown: HTMLDivElement;
}

export type KeyElementsMapSearchRow = KeyElementsMap<IKeyElementsMapSearchRow>;

/**
 * @class SearchRowView
 */
export default class SearchRowView extends BaseComponentView {
  keyElems: KeyElementsMapSearchRow;

  /**
   * @param {boolean} isDisplayRelative
   * @param {boolean} isDefaultOpen
   * @return {HTMLElement}
   */
  render(isDisplayRelative: boolean, isDefaultOpen: boolean): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = <string> SearchRowComponent({
      relative: isDisplayRelative,
      open: isDefaultOpen,
    });
    const sr = <HTMLElement> wrapper.firstElementChild;

    const searchBtn = <HTMLButtonElement> sr.querySelector('.search__button');
    const searchInput = <HTMLInputElement> sr.querySelector('.search__input');
    const SearchRow = <HTMLDivElement> sr.querySelector('.search__row');
    const groupOptions = <HTMLDivElement> sr.querySelector(
      '.search__row_group_dropdown',
    );
    const groupBar = <HTMLInputElement> groupOptions.querySelector('.search__row_group_bar');
    const groupDropDown = <HTMLDivElement> groupOptions.querySelector('.search__row_group_dropdown-content');

    if (!(searchBtn && searchInput && SearchRow && groupOptions && groupBar && groupDropDown)) {
      console.warn(
        '{SearchRow} component template contains an error',
      );
      return document.createElement('div');
    }

    this.keyElems = {
      searchBtn,
      searchInput,
      SearchRow,
      groupOptions,
      groupBar,
      groupDropDown,
    };

    return sr;
  }
}

