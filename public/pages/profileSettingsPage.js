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
      const firstName =
          form.querySelector('input[name="username"]')?.value.trim();
      const lastName =
          form.querySelector('input[name="surname"]')?.value.trim();
      const img = form.querySelector('input[type="file"]')?.files[0];

      if (firstName !== '' && !regexp.firstName.test(firstName)) {
        this.view.pageComponents.settingsForm.appendWarning(
            'Такое имя выбрать нельзя',
        );
        return;
      }

      if (lastName !== '' && !regexp.lastName.test(lastName)) {
        this.view.pageComponents.settingsForm.appendWarning(
            'Такую фамилию выбрать нельзя',
        );
        return;
      }

      if (img && !img.type.startsWith('image/')) {
        ModalTemplates.warn('Ошибка', 'Выберите изображение');
        return;
      }

      // если пароли не совпадают TODO:
      // if (showRegister && passwordRepeated !== password) {
      //   formWarning.style.display = 'block';
      //   formWarningLabel.style.display = 'block';
      //   formWarning.textContent = 'Удостоверьтесь, что пароли совпадают';
      //   return;
      // }

      let responseStatus = 0;
      let avatarHash = '';
      new Promise((resolve, reject) => {
        if (img) {
          resolve(img);
        } else {
          reject(new Error('Картинка не прекреплена'));
        }
      })
          .then(() => Ajax.postFile({url: '/img/upload', body: img}))
          .then(({status, response}) => new Promise((resolve, reject) => {
            if (status === Ajax.STATUS.ok) {
              resolve(response.data.imgId);
            } else {
              responseStatus = status;
              reject(new Error(response.msg));
            }
          }))
          // Падает, если не прикреплена картинка - надо восстановить цепочку,
          // а если Ajax, то перейти в конец
          .catch((err) => new Promise((resolve, reject) => {
            if (responseStatus === 0) {
              resolve('');
            } else {
              reject(err);
            }
          }))
          .then((avatarUrl) => {
            // прокидываем картинку в юзердату
            avatarHash = avatarUrl;
            return Ajax.post({
              url: '/user/profile/update',
              body: {
                // password,
                firstName,
                lastName,
                avatarUrl,
              },
            });
          })
          .then(({status, response}) => new Promise((resolve, reject) => {
            if (status === Ajax.STATUS.ok) {
              resolve(response.data);
            } else {
              responseStatus = status;
              reject(new Error(response.msg));
            }
          }))
          .then((userData) => {
            if (avatarHash !== '') {
              userData.avatarUrl = avatarHash;
            }
            store.dispatch(authorizationActions.login(userData));
            ModalTemplates.informativeMsg('Успех!', 'Профиль обновлен');
            redirect('/profile');
            return;
          })
          .catch(({message}) => {
            if (responseStatus === Ajax.STATUS.invalidSession) {
              store.dispatch(authorizationActions.logout());
              ModalTemplates.informativeMsg(
                  'Сессия устарела', 'Пройдите авторизацию',
              );
              redirect('/login');
              return;
            }
            if (ajaxDebug) {
              console.warn(message);
            }
            // В случае ошибки сервера
            if ((responseStatus + '')[0] === '5') {
              ModalTemplates.netOrServerError(responseStatus, message);
              return;
            }
            // в случае провала валидации формы
            this.view.pageComponents.settingsForm.appendWarning(msg);
          });
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
