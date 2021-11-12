import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import SettingsForm from '../components/settings/settingsForm.js';

// ///////////////////////////////// //
//
//       Profile Setting Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - форму изменения профиля.
 * @class ProfileSettingsPageView
 */
export default class ProfileSettingsPageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.pageComponents = {
      settingsForm: new SettingsForm(),
    };
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    this.root.appendChild(createPage(this.pageComponents.settingsForm));
  }
}
