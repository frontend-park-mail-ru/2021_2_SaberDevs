import BasePageMV from './basePageMV.js';
import ProfileSettingsPageView from './profileSettingsPageView.js';

import ModalTemplates from '../components/modal/modalTemplates.js';

import store from '../flux/store.js';
import {
  changePageActions,
  authorizationActions,
} from '../flux/actions.js';
import {authorizationTypes} from '../flux/types.js';

import Ajax from '../modules/ajax.js';
import {redirect} from '../common/utils.js';
import regexp from '../common/regexp.js';

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

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    store.subscribe(authorizationTypes.LOGOUT, () => {
      if (this.isActive()) {
        console.log('[ProfileSettingsPage] Logout reaction');
        redirect('/');
      }
    });
  }

  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();

    const form = this.view.root.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO: смена пароля
      // const password = form.querySelector('input[name="password"]');
      const firstName = form.querySelector('input[name="username"]')?.value;
      const lastName = form.querySelector('input[name="surname"]')?.value;
      if (!regexp.firstName.test(firstName)) {
        this.view.pageComponents.settingsForm.appendWarning(
            'Такое имя выбрать нельзя',
        );
        return;
      }

      if (!regexp.lastName.test(lastName)) {
        this.view.pageComponents.settingsForm.appendWarning(
            'Такую фамилию выбрать нельзя',
        );
        return;
      }

      // если пароли не совпадают
      if (showRegister && passwordRepeated !== password) {
        formWarning.style.display = 'block';
        formWarningLabel.style.display = 'block';
        formWarning.textContent = 'Удостоверьтесь, что пароли совпадают';
        return;
      }
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
                  redirect('/profile');
                  return;
                }
                if (status === Ajax.STATUS.invalidSession) {
                  store.dispatch(authorizationActions.logout());
                  ModalTemplates.informativeMsg(
                      'Сессия устарела', 'Пройдите авторизацию',
                  );
                }
                const msg = response.msg;
                // В случае ошибки сервера
                if ((status + '')[0] === '5') {
                  ModalTemplates.netOrServerError(status, msg);
                  return;
                }
                // в случае провала валидации формы
                this.view.pageComponents.settingsForm.appendWarning(msg);
              },
          ).catch((error) => console.warn(error));
    });

    store.dispatch(
        changePageActions.changePage(
            'profileSettings',
            `Settings | ${store.getState().authorization.login}`,
        ),
    );
  }

  /**
   * Вызывается в роутере. Если return не '', нужно выполнить переход
   * по пути, возвращенному из функции
   *
   * Возможны редиректы на: /login
   * @param {string} currentPath
   * @return {string}
   */
  redirect(currentPath) {
    if (store.getState().authorization.login !== '') {
      return '';
    }
    return '/login';
  }
}
