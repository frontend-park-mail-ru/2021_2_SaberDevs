import BaseComponent from '../_basic/baseComponent';
import HeaderView from './headerView';
import SearchRow from '../searchRow/searchRow';


import store from '../../flux/store';
import editorActions from '../../flux/actions/editorActions';
import {SearchTypes} from '../../flux/types';
import searchActions from '../../flux/actions/searchActions';

import {redirect} from '../../common/utils.js';

import MobileLayoutUtils from '../../common/mobileLayout.js';

import {KeyElementsMapHeader} from './HeaderView';

/**
 * ViewModel-компонент соответсвующего View
 * @class Header
 */
export default class Header extends BaseComponent {

  view: HeaderView;

  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new HeaderView();

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    this.unsubscribes.push(
        store.subscribe(
            SearchTypes.SUBMIT_ON_HEADER,
            () => {
              const state = store.getState().search;
              redirect(`/search?g=${state.group}&q=${state.value}`);
            },
        ),
    );
  }

  get keyElems(): KeyElementsMapHeader {
    return this.view.keyElems;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();

    this.root = this.view.render();
    if (!this.keyElems) {
      return document.createElement('div');
    }

    // устанавливаем поисковую строку
    const sr: SearchRow = new SearchRow(
        searchActions.submitOnHeader,
        true,
        () => {
          this.keyElems.addArticleBtn.classList.add('hide');
          this.keyElems.navItems.style.pointerEvents = 'none';
          if (MobileLayoutUtils.isDevicePhone()) {
            this.keyElems.headerTitle.style.display = 'none';
          }
        },
        () => {
          this.keyElems.addArticleBtn.classList.remove('hide');
          this.keyElems.navItems.style.pointerEvents = 'all';
          this.keyElems.headerTitle.style.display = 'flex';
        },
    );
    sr.mountInPlace(this.root);

    this.root.querySelector('.header__add-article-btn-sign')
        .addEventListener(
          'click',
          () => store.dispatch(editorActions.createArticle()),
        );

    return this.root;
  }
};
