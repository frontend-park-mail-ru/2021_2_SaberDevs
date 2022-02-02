import BasePageMV from './basePageMV.js';
import EditorView from './articleEditorView.js';

import store from '../flux/store.js';
import ModalTemplates from '../components/modal/modalTemplates.js';
import {AuthorizationTypes} from '../flux/types';
import {changePageActions} from '../flux/actions.js';
import {redirect} from '../common/utils.js';

/**
   * Проверяет состояние editor
   * @return {boolean}
   */
function isUpdate() {
  const state = store.getState().editor;
  return typeof state.currentId === 'string' && state.currentId !== '0' ||
         typeof state.currentId === 'number' && state.currentId !== 0;
}

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

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    store.subscribe(AuthorizationTypes.LOGOUT, () => {
      console.log('[ArticleEditorPage] Logout reaction');
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
    if (!store.getState().authorization.firstName ||
        !store.getState().authorization.lastName) {
      ModalTemplates.needFullRegConfirm(
          'Только пользователи, указавшие имя и фамилию могут быть авторами.',
          'Вы можете ознакомиться с интерфейсом, но статью создать не сможете.',
      );
    }
    super.show();
    store.dispatch(
        changePageActions.changePage(
            'editor',
            `SaberProject | ${isUpdate() ? 'Edit' : 'Create'} article`,
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
    if (store.getState().authorization.isAuthenticated) {
      return '';
    }
    return '/login';
  }
}
