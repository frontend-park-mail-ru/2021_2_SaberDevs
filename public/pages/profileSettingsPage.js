import BasePageMV from './basePageMV.js';
import ProfileSettingsPageView from './profileSettingsPageView.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';

// import Ajax from '../modules/ajax.js';

// ///////////////////////////////// //
//
//         Profile Settings Page
//
// ///////////////////////////////// //

/**
 * @class ProfileSettingsPage
 */
export default class ProfileSettingsPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new ProfileSettingsPageView(root);
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();
    store.dispatch(
        changePageActions.changePage(
            'profileSettings',
            `Settings | ${store.getState().authorization.login}`,
        ),
    );
  }
}
