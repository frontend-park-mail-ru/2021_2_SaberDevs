import BasePageMV from './basePageMV.js';
import MainPageView from './mainPageView.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';

// ///////////////////////////////// //
//
//              Main Page
//
// ///////////////////////////////// //


/**
 * @class MainPage
 * @module MainPage
 */
export default class MainPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new MainPageView(root);
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();
    store.dispatch(
        changePageActions.changePage(
            'main',
            `SaberProject`,
        ),
    );
  }
}
