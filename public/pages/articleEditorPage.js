import BasePageMV from './basePageMV.js';
import EditorView from './articleEditorView.js';

import Ajax from '../modules/ajax.js';

import store from '../flux/store.js';
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
  }

  /**
   * Страница содержит главный компонент - интерфейс изменения статьи.
   * Компонент управляется собственным StateObject Editor
   */
  show() {
    const state = store.getState().editor;
    const existingArticle = {
      title: state.title,
      text: state.text,
      tags: state.tags,
    };

    this.view.show(existingArticle);
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
