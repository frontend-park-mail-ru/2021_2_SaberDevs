import BaseComponent from '../_basic/baseComponent.js';
import ReaderView from './readerView.js';

import store from '../../flux/store.js';
import {readerTypes, authorizationTypes} from '../../flux/types.js';
import editorActions from '../../flux/actions/editorActions.js';

const changeBtnClickListener = (e) => {
  e.preventDefault();
  const state = store.getState().reader;
  const article = state[state.currentId];
  store.dispatch(editorActions.editArticle(article.id, article));
};

/**
 * Компонент для чтения статей
 * @class Reader
 */
export default class Reader extends BaseComponent {
  /**
   * Окошко сообщений о состоянии сервиса
   */
  constructor() {
    super();
    this.view = new ReaderView();

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    this.unsubscribes.push(
        store.subscribe(readerTypes.OPEN_ARTICLE, () => {
          const state = store.getState().reader;
          this.openArticle(state[state.currentId]);
        }),
        store.subscribe(authorizationTypes.LOGIN, () => {
          const articleChangeBtn =
            this.root.querySelector('#article-change-btn');
          if (!articleChangeBtn) {
            console.warn('{READER} component hasn\'t been rendered yet');
            return;
          }
          // Берем автора статьи по полю логина в верстке
          const author =
            this.root.querySelector('.article-view__author').textContent;
          if (author === store.getState().authorization.login) {
            articleChangeBtn.style.display = 'block';
            articleChangeBtn.href = '/editor';
            articleChangeBtn.addEventListener('click', changeBtnClickListener);
          }
        }),
        store.subscribe(authorizationTypes.LOGOUT, () => {
          const articleChangeBtn =
            this.root.querySelector('#article-change-btn');
          if (!articleChangeBtn) {
            console.warn('{READER} component hasn\'t been rendered yet');
            return;
          }
          articleChangeBtn.style.display = 'none';
          articleChangeBtn.href = undefined;
          articleChangeBtn.removeEventListener('click', changeBtnClickListener);
        }),
    );
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();

    const state = store.getState().reader;
    this.root = this.view.render(state[state.currentId]);
    this.root.querySelectorAll('.article-view__tag').forEach((tag) => {
      tag.href = '/categories';
    });
    // пока контент статьи не прогрузился, изменять статью не даем
    return this.root;
  }

  /**
    * Задать содержание статьи
    * @param {Object} article
    * @property {string} title
    * @property {string} text
    * @property {Array<string>} tags
    * @property {string} datetime
    * @property {Object} author
    * @property {number} likes
    * @property {number} comments
    */
  openArticle(article) {
    this.root.innerHTML = '';
    this.view.render(article).childNodes.forEach((node) => {
      this.root.appendChild(node.cloneNode(true));
    });
    this.root.querySelector('#article-change-btn').href =
      '/user/' + article.author.login;
    this.root.querySelectorAll('.article-view__tag').forEach((tag) => {
      tag.href = '/categories';
    });
    const authLogin = store.getState().authorization.login;
    if (article.author.login === authLogin) {
      const articleChangeBtn = this.root.querySelector('#article-change-btn');
      articleChangeBtn.style.display = 'block';
      articleChangeBtn.href = '/editor';
      articleChangeBtn.addEventListener('click', changeBtnClickListener);
    }
  }
}
