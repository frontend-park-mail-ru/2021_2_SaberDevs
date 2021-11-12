import BasePageMV from './basePageMV.js';
import ReaderView from './articleReaderView.js';

import store from '../flux/store.js';
import readerActions from '../flux/actions/readerActions.js';

import Ajax from '../modules/ajax.js';
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
    // берем id из урла
    const idUrlParam = document.URL.slice(document.URL.indexOf('article/') + 8);
    console.warn('[ArticleReaderPage] id from Url ', document.URL, idUrlParam);
    store.dispatch(readerActions.setArticleLoading({id: idUrlParam}));
    store.dispatch(readerActions.openArticle(idUrlParam));
    // onLoad
    Ajax.get({url: `/articles?id=${idUrlParam}`})
        .then(({status, response}) => {
          if (status === Ajax.STATUS.ok) {
            store.dispatch(readerActions.saveArticle(response.data));
            store.dispatch(readerActions.openArticle(response.data.id));
            return;
          }

          if (status / 500 === 1) {
            Modal.setTitle(`Сервис временно не доступен: ${status}`);
          }
          if (status / 400 === 1) {
            Modal.setTitle(/* пользовательская */`Ошибка ${status}`);
          }
          Modal.setContent(response.msg);
          Modal.open(false);
        })
        .catch((err) => console.warn(err.message));
  }
}