import BasePageMV from './basePageMV.js';
import ReaderView from './articleReaderView.js';

import store from '../flux/store.js';
import readerActions from '../flux/actions/readerActions.js';
/**
 * @class ReaderPage
 */
export default class ReaderPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new ReaderView(root);
  }

  /**
   * Страница содержит главный компонент - интерфейс просмотра статьи.
   * Компонент управляется собственным StateObject Reader
   */
  show() {
    super.show();
    // TODO: сходить здесь в сеть задиспатчить
    // const state = store.getState().reader;
    // const article = state[state.currentId];

    // берем id из урла
    const idUrlParam = document.URL.slice(document.URL.indexOf('article/') + 8);
    console.warn('[ArticleReaderPage] id from Url ', document.URL, idUrlParam);
    store.dispatch(readerActions.setArticleLoading({id: idUrlParam}));
    store.dispatch(readerActions.openArticle(idUrlParam));
    // onLoad
    // store.dispatch(readerActions.saveArticle(article));
    // store.dispatch(readerActions.openArticle(idUrlParam));
  }
}
