import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import SettingsForm from '../components/settings/settingsForm.js';

import store from '../flux/store.js';
import {authorizationTypes} from '../flux/types.js';

import Ajax from '../modules/ajax.js';
import {redirect} from '../utils.js';

import Modal from '../components/modal/modal.js';

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

    store.subscribe(authorizationTypes.LOGOUT, () => {
      if (this.isActive()) {
        redirect('/');
      }
    });
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    this.root.appendChild(createPage(this.pageComponents.settingsForm));

    // TODO: вынести в MV
    const form = this.root.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO: смена пароля
      // const password = form.querySelector('input[name="password"]');
      const firstName = form.querySelector('input[name="username"]')?.value;
      const lastName = form.querySelector('input[name="surname"]')?.value;
      Ajax.post({
        url: '/user/profile/update',
        body: {
          // password,
          firstName,
          lastName,
        },
      })
          .then(
              ({status, response}) => {
                if (status === Ajax.STATUS.ok) {
                  store.dispatch(authorizationActions.login(response.data));
                  return;
                }
                // В случае ошибки
                if (status / 100 === 5) {
                  Modal.setTitle(`Сервис временно не доступен: ${status}`);
                }
                if (status / 100 === 4) {
                  Modal.setTitle(/* пользовательская */`Ошибка ${status}`);
                }
                Modal.setContent(response.msg);
                Modal.open(false);
              },
          ).catch((error) => console.warn(error));
    });
  }
}
