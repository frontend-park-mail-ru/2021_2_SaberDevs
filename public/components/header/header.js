import BaseComponent from '../_basic/baseComponent.js';
import HeaderView from './headerView.js';
import SearchRow from '../searchRow/searchRow.js';


import store from '../../flux/store.js';
import editorActions from '../../flux/actions/editorActions.js';
import {SearchTypes} from '../../flux/types';
import searchActions from '../../flux/actions/searchActions.js';

import {redirect} from '../../common/utils.js';

import MobileLayoutUtils from '../../common/mobileLayout.js';

/**
 * ViewModel-компонент соответсвующего View
 * @class Header
 */
export default class Header extends BaseComponent {
  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new HeaderView();

    // communication
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

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();

    const navItems = this.root.querySelector('.header__nav-items');
    const addArticleBtn = this.root.querySelector('a.header__add-article-btn');
    const headerTitle = this.root.querySelector('.header__title-block');

    // устанавливаем поисковую строку
    const sr = new SearchRow(
        searchActions.submitOnHeader,
        true,
        () => {
          addArticleBtn.classList.add('hide');
          navItems.style.pointerEvents = 'none';
          if (MobileLayoutUtils.isDevicePhone()) {
            headerTitle.style.display = 'none';
          }
        },
        () => {
          addArticleBtn.classList.remove('hide');
          navItems.style.pointerEvents = 'all';
          headerTitle.style.display = 'flex';
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
