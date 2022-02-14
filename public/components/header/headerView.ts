import BaseComponentView from '../_basic/baseComponentView';
import headerComponent from './header.pug.js';

import {KeyElementsMap, IKeyElementsMap} from '../_basic/baseComponentView';

interface IKeyElementsMapHeader extends IKeyElementsMap {
  navItems: HTMLDivElement;
  addArticleBtn: HTMLAnchorElement;
  headerTitle: HTMLDivElement;
}

export type KeyElementsMapHeader = KeyElementsMap<IKeyElementsMapHeader>;

/**
 * @class HeaderView
 */
export default class HeaderView extends BaseComponentView {
  keyElems: KeyElementsMapHeader;

  /**
    * @return {HTMLElement}
    */
  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = <string> headerComponent();
    const header = <HTMLElement> wrapper.firstElementChild;

    const navItems = <HTMLDivElement> header.querySelector('.header__nav-items');
    const addArticleBtn = <HTMLAnchorElement> header.querySelector('a.header__add-article-btn');
    const headerTitle = <HTMLDivElement> header.querySelector('.header__title-block');

    if (!(navItems && addArticleBtn && headerTitle)) {
      console.warn(
        '{Header} component template contains an error',
      );
      return document.createElement('div');
    }
    this.keyElems = {
      navItems,
      addArticleBtn,
      headerTitle,
    };
    return header;
  }
}
