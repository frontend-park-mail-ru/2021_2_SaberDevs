import BasePageMV from './basePageMV.js';
import EditorView from './articleEditorView.js';

import store from '../flux/store.js';
import Modal from '../components/modal/modal.js';
import {authorizationTypes} from '../flux/types.js';
import {redirect} from '../utils.js';

/**
 * @class EditorPage
 */
export default class EditorPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new EditorView(root);
    store.subscribe(authorizationTypes.LOGOUT, () => {
      Modal.configurate({
        title: 'Вы неавторизованы',
        content: `Чтобы продолжить редактирование, выполните вход.
        Текущее состояние сохранено.
        Не перезагружайте страницу.`,
        isEnteractive: true,
        isCancelable: false,
        onConfirm: () => redirect('/'),
      });
      Modal.open();
    }),
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
