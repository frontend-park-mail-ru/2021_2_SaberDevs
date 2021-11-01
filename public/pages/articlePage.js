import BasePageMV from './basePageMV.js';
import ArticlePageView from './articlePageView.js';

import Ajax from '../modules/ajax.js';

import store from '../flux/store.js';
/**
 * ModalView-контроллер для соответсвующих страниц
 * @class ArticlePage
 */
export default class ArticlePage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new ArticlePageView(root);
  }

  /**
   * Страница содержит главный компонент - интерфейс изменения статьи.
   * Если страница рисуется без параметра или с null, то будет отправлен
   * запрос на СОЗДАНИЕ новой статьи
   * Если был передан объект, описывающий статью, то будет отправлен
   * запрос на ОБНОВЛЕНИЕ существующей статьи
   */
  show() {
    const state = store.getState().articleEdit;
    const existingArticle = {
      // id: state.id,
      // login: state.id,
      text: state.text,
      tags: state.tags,
    };

    this.view.show(existingArticle);

    const form = this.view.root.querySelector('form');
    const content = form.querySelector('textarea').value;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const body = {
        login: store.getState().authorization.login,
        content,
      };
      if (existingArticle?.id) {
        Object.assign(body, {articleId: existingArticle.id});
      }
      Ajax.post({
        url: `/api/v1/articles/${existingArticle?.id ? 'update' : 'create'}`,
        body,
      });
    });
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
