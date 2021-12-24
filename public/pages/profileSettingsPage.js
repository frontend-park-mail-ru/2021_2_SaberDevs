import BasePageMV from './basePageMV.js';
import ProfileSettingsPageView from './profileSettingsPageView.js';

import ModalTemplates from '../components/modal/modalTemplates.js';

import store from '../flux/store.js';
import {
  changePageActions,
  authorizationActions,
} from '../flux/actions.js';
import profilePageActions from '../flux/actions/profilePageActions.js';
import {authorizationTypes} from '../flux/types.js';
import {appendApiImg} from '../common/transformApi.js';

import Ajax from '../modules/ajax.js';
import {redirect, getFileBrowserStorageUrl} from '../common/utils.js';
import regexp from '../common/regexp.js';
import {ajaxDebug} from '../globals.js';

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

    const auth = store.getState().authorization;
    const form = this.view.root.querySelector('form');

    // вписываем текущие данные
    form.querySelector('input[name="username"]').value = auth.firstName || '';
    form.querySelector('input[name="surname"]').value = auth.lastName || '';
    form.querySelector('textarea[name="description"]').value =
        auth.description || '';

    const previewImg = form.querySelector('img');
    previewImg.addEventListener('error', (e) => {
      console.warn('не удалось загрузить аватар', e.currentTarget.src);
      e.currentTarget.src='img/user_icon_loading.svg';
      e.currentTarget.onerror = undefined;
    });
    appendApiImg(auth);
    previewImg.src = auth.avatarUrl;

    const fileLoader = form.querySelector('input[type="file"]');
    fileLoader.addEventListener(
        'change',
        (e) => {
          const file = e.currentTarget.files[0];

          if (!file.type.startsWith('image/')) {
            ModalTemplates.warn('Что-то не так', 'Выберите изображение');
            return;
          }
          getFileBrowserStorageUrl(file).then((imgUrl) => {
            previewImg.src = imgUrl;
          });
        });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO: смена пароля
      // const password = form.querySelector('input[name="password"]');
      const firstName =
          form.querySelector('input[name="username"]')?.value.trim();
      const lastName =
          form.querySelector('input[name="surname"]')?.value.trim();
      const description =
          form.querySelector('textarea[name="description"]')?.value.trim();
      const img = fileLoader.files[0];

      if (firstName !== '' && !regexp.firstName.test(firstName)) {
        let errorClass = 0;
        if (/\d/.test(firstName)) {
          errorClass = 1;
        } else if (firstName.length >= 20) {
          errorClass = 2;
        } else if (firstName.length < 2) {
          errorClass = 3;
        } else if (firstName.search(/\s/) !== -1) {
          errorClass = 4;
        } else if (firstName.search(/\W/) !== -1) {
          errorClass = 5;
        }
        this.view.pageComponents.settingsForm.appendWarning(
            'Такое имя выбрать нельзя' +
            (errorClass === 1 ? '. Цифр быть не должно.' : '') +
            (errorClass === 2 ? '. Слишком длинное.' : '') +
            (errorClass === 3 ? '. Слишком короткое.' : '') +
            (errorClass === 4 ? '. Имя не должно содержать ' +
                'пробельных символов.' : '') +
            (errorClass === 5 ? '. Имя не должно содержать ' +
                'разделителей и знаков пунктуации.' : '') +
            (errorClass === 0 ? `. Примеры имён:<br/>
            Мартин<br/>
            Ай<br/>
            Чао<br/>
            Salah` : ''),
        );
        return;
      }

      if (lastName !== '' && !regexp.lastName.test(lastName) ||
          lastName.length >= 20) {
        let errorClass = 0;
        if (/\d/.test(lastName)) {
          errorClass = 1;
        } else if (lastName.length >= 20) {
          errorClass = 2;
        } else if (lastName.length < 2) {
          errorClass = 3;
        } else if (firstName.search(/\s/) !== -1) {
          // та регулярка круче
          errorClass = 4;
        } else if (firstName.search(/\W/) !== -1) {
          errorClass = 5;
        }
        this.view.pageComponents.settingsForm.appendWarning(
            'Такую фамилию выбрать нельзя' +
            (errorClass === 1 ? '. Цифр быть не должно.' : '') +
            (errorClass === 2 ? '. Слишком длинная.' : '') +
            (errorClass === 3 ? '. Слишком короткая.' : ''),
            (errorClass === 4 ? '. Фамилия не должна содержать ' +
                'пробельных символов.' : '') +
            (errorClass === 5 ? '. Фамилия не должна содержать ' +
                'разделителей и знаков пунктуации.' : '') +
            (errorClass === 0 ? `. Примеры фамилий:<br/>
            Смит<br/>
            Deniels<br/>
            Ли
            ` : ''),
            // (errorClass === 0 ? `. Примеры фамилий:<br/>
            // Смит<br/>
            // Доу-Смит<br/>
            // д'Аррас<br/>
            // Лютер Кинг<br/>
            // Deniels<br/>
            // Ad-Din<br/>
            // Di Angelo
            // ` : ''),
        );
        return;
      }

      if (img && !img.type.startsWith('image/')) {
        ModalTemplates.warn('Что-то не так', 'Выберите изображение');
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
                description,
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
              userData.avatarUrl = Ajax.APIurl + '/img/' + avatarHash;
            }
            store.dispatch(authorizationActions.login(userData));
            store.dispatch(profilePageActions.setUserInfo(userData));
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
            // this.view.pageComponents.settingsForm.appendWarning(message);
            ModalTemplates.warn('Что-то не так', message);
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
