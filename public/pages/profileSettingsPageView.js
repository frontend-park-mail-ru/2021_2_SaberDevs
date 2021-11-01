import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import SettingsForm from '../components/settings/settingsForm.js';

import Ajax from '../modules/ajax.js';

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

    // TODO: подписка на логаут
    // проверка авторизации
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    this.root.appendChild(createPage(this.pageComponents.settingsForm));
    const form = this.view.root.querySelector('form');
    form.addEventListener('submit', (e) => {
      // TODO: смена пароля
      // const password = form.querySelector('input[name="password"]');
      const password = '';
      const firstName = form.querySelector('input[name="username"]')?.value;
      const lastName = form.querySelector('input[name="surname"]')?.value;
      Ajax.post({
        url: '/user/profile/update',
        body: {
          password,
          firstName,
          lastName,
        },
      })
          .then(
              ({status, response}) => {
                if (status === Ajax.STATUS.ok) {
                  store.dispatch(authorizationActions.login(response.data));
                }
              },
          );
    });
  }
}
