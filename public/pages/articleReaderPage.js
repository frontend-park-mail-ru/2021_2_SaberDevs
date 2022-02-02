import BasePageMV from './basePageMV.js';
import ReaderPageView from './articleReaderPageView.js';

import store from '../flux/store.js';
import readerActions from '../flux/actions/readerActions.js';
import {changePageActions} from '../flux/actions.js';

import Ajax from '../modules/ajax';
import {showModalNetOrServerError} from '../components/modal/modalTemplates.js';

import {translateServerComment} from '../common/transformApi.js';
import {redirectOuter} from '../common/utils.js';

/**
 * @class ReaderPage
 */
export default class ReaderPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new ReaderPageView(root);
  }

  /**
   * Страница содержит главный компонент - интерфейс просмотра статьи.
   * Компонент управляется собственным StateObject Reader
   */
  show() {
    super.show();
    store.dispatch(
        changePageActions.changePage(
            'reader',
            `SaberProject | Article View`,
        ),
    );
    // берем id из урла
    let idUrlParam = document.URL.slice(document.URL.indexOf('article/') + 8);
    const anchorPos = idUrlParam.indexOf('#');
    let anchor = '';
    if (anchorPos !== -1) {
      anchor = idUrlParam.slice(anchorPos);
      idUrlParam = idUrlParam.slice(0, anchorPos);
    }
    console.warn('[ArticleReaderPage] id from Url ', document.URL, idUrlParam);
    store.dispatch(readerActions.setArticleLoading({id: idUrlParam}));
    store.dispatch(readerActions.openArticle(idUrlParam));

    let responseStatus = 0;
    Ajax.get({url: `/articles?id=${idUrlParam}`})
        .then(({status, response}) => new Promise((resolve, reject) => {
          if (status === Ajax.STATUS.ok) {
            resolve(response.data);
          } else {
            responseStatus = status;
            reject(new Error(response.msg));
          }
        }))
        .then((article) => {
          store.dispatch(readerActions.saveArticle(article));
          store.dispatch(readerActions.openArticle(article.id));
          // После загрузки перекидываем на часть документа с якорем
          if (anchor) {
            redirectOuter(document.URL);
          }
        })
        .then(() => Ajax.get({url: `/comments?id=${idUrlParam}`}))
        .then(({status, response}) => new Promise((resolve, reject) => {
          if (status === Ajax.STATUS.ok) {
            resolve(response.data);
          } else {
            responseStatus = status;
            reject(new Error(`Комментарии загрузить не удалось
            ${response.msg}`));
          }
        }))
        // рисуем комменты
        .then((comments) => {
          // здесь можно преобразовать типы при необходимости.
          comments = comments
              .map((element) => translateServerComment(element));
          const baseComments = comments.filter((el) => el.parentId === 0)
              .sort((a, b) => a.datetimeMS < b.datetimeMS ? -1 : 1);
          baseComments.forEach((baseComment) => {
            baseComment.answers = comments
                .filter((el) => el.parentId === baseComment.id)
                .sort((a, b) => a.datetimeMS < b.datetimeMS ? -1 : 1);
          });
          store.dispatch(
              readerActions.saveArticleComments(idUrlParam, baseComments),
          );
        })
        // не удалось загрузить статью или произошла другая ошибка
        .catch((err) => {
          if (responseStatus !== 0) {
            showModalNetOrServerError(responseStatus, err.message);
          } else {
            console.warn(err.message);
          }
        });
  }
}
