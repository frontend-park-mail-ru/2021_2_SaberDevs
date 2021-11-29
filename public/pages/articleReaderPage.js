import BasePageMV from './basePageMV.js';
import ReaderPageView from './articleReaderPageView.js';

import store from '../flux/store.js';
import readerActions from '../flux/actions/readerActions.js';
import {changePageActions} from '../flux/actions.js';

import Ajax from '../modules/ajax.js';
import {showModalNetOrServerError} from '../components/modal/modalTemplates.js';

import {
  appendApiImg,
  getRusDateTime,
  translateServerDateToMS,
} from '../common/utils.js';

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
    const idUrlParam = document.URL.slice(document.URL.indexOf('article/') + 8);
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
          // TODO: приходят не строки. Хорошо бы, чтоы Леша пофиксил
          // здесь можно преобразовать типы при необходимости.
          comments.forEach((element) => {
            appendApiImg(element.author);
            // привожу 2021/11/23 13:13 к ISO 8601
            // https://ru.wikipedia.org/wiki/ISO_8601
            element.datetimeMS = translateServerDateToMS(element.dateTime);
            delete element.dateTime;
            element.datetime = getRusDateTime(element.datetimeMS);
          });
          const baseComments = comments.filter((el) => el.parentId === 0);
          baseComments.forEach((baseComment) => {
            baseComment.answers = comments
                .filter((el) => el.parentId === baseComment.id)
                // TODO: проверить
                .sort((a, b) => a.datetimeMS < b.datetimeMS ? -1 : 1);
            // .sort((a, b) => {
            //   if (a.datetime < b.datetime) {
            //     return -1;
            //   } else {
            //     return 1;
            //   }
            // });
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
