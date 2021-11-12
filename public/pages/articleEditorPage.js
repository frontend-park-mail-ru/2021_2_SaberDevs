import BasePageMV from './basePageMV.js';
import EditorView from './articleEditorView.js';

import store from '../flux/store.js';
import ModalTemplates from '../components/modal/modalTemplates.js';
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
      if (this.isActive()) {
        ModalTemplates.warn(
            'Вы неавторизованы',
            `Чтобы продолжить редактирование, выполните повторный вход.
            Текущее состояние сохранено. Не перезагружайте страницу.`,
            () => redirect('/'),
        );
      }
    });
  }
  /**
   * Отобразить подконтрольную страницу.
   */
  show() {
    super.show();
    store.dispatch(
        changePageActions.changePage(
            'editor',
            `Article | ${this.view.isUpdate() ? 'Edit' : 'Create'}`,
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
