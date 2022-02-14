import BasePageView from './basePageView';
import createPage from './_createPage.js';

import SettingsForm from '../components/settings/settingsForm';

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
    this.root.appendChild(createPage(
        'Настройки пользователя',
        this.pageComponents.settingsForm,
    ));
  }
}
