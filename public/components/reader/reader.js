import BaseComponent from '../_basic/baseComponent.js';
import ReaderView from './readerView.js';
import commentComponent from './comment.pug.js';
import articleAddCommentComponent from './articleAddComment.pug.js';

import ModalTemplates from '../../components/modal/modalTemplates.js';

import Ajax from '../../modules/ajax.js';

import store from '../../flux/store.js';
import {readerTypes, authorizationTypes} from '../../flux/types.js';
import editorActions from '../../flux/actions/editorActions.js';

import {getRusDateTime, translateServerDateToMS} from '../../common/utils.js';

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
        store.subscribe(readerTypes.OPEN_ARTICLE, (id) => {
          const state = store.getState().reader;
          this.openArticle(state[id]);
        }),

        // Если подгрузили комментарии к текущей статье - отрисовать
        store.subscribe(readerTypes.SAVE_ARTICLE_COMMENTS, ({id, comments}) => {
          if (store.getState().reader.currentId === id) {
            this.setComments(comments);
          }
        }),

        // даем возможность редактирования если статья принадлежит пользователю
        store.subscribe(authorizationTypes.LOGIN, () => {
          const articleChangeBtn =
            this.root.querySelector('#article-change-btn');
          if (!articleChangeBtn) {
            console.warn('{READER} component hasn\'t been rendered yet');
            return;
          }
          // Берем автора статьи по полю логина в верстке
          const author =
            this.root.querySelector('div.article-view__author > a').textContent;
          if (author === store.getState().authorization.login) {
            articleChangeBtn.style.display = 'block';
            articleChangeBtn.href = '/editor';
            articleChangeBtn.addEventListener('click', changeBtnClickListener);
          }
        }),

        // забираем возможность изменения статьи, если пропадает авторизация
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

    addEventListenersToReader(this.root);

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

    addEventListenersToReader(this.root);

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

  /**
   * @typedef {Object} Comment
   * @property {string} text
   * @property {string} articleId
   * @property {string} id
   * @property {string} dateTime
   * @property {boolean} isEdited
   * @property {User} author
   */

  /**
   * @param {Array<Comment>} comments
   */
  setComments(comments) {
    const commentsDiv = this.root.querySelector('#comments');
    comments.forEach((comment) => {
      const commentWrapper = document.createElement('div');
      commentWrapper.innerHTML = commentComponent(comment);
      commentsDiv.appendChild(commentWrapper.firstChild);
    });
  }
}

// TODO: вынести сетевые обработчики на страницу
/**
 * Добавление обработчиков
 * @param {HTMLDivElement} root
 */
function addEventListenersToReader(root) {
  // обработчик: добавление комментария
  const commentBtn = root
      .querySelector('.article-view__send-comment-btn');
  commentBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const comments = root.querySelector('#comments');
    commentAdd(comments);
  });

  // обработчик: показать комментарии
  const btnShow = root
      .querySelector('.comments-show');
  btnShow.addEventListener('click', (e) => {
    e.preventDefault();
    commentsShow();
  });

  // обработчик: ответить на комментарий
  const comments = root
      .querySelectorAll('.comments__comment');
  for (const comment of comments) {
    answerOnComment(comment);
  }
}

/**
 * Добавление комментария
 * @param {Element} parent
 */
function commentAdd(parent) {
  if (!store.getState().authorization.isAuthenticated) {
    ModalTemplates.warn(
        'Сначала авторизируйтесь',
        'Чтобы оставить комментарий, выполните вход',
    );
    return;
  }

  const input = document.querySelector('.article-view__comment-input');
  if (input.value != '') {
    let responseStatus = 0;
    Ajax.post({url: '/comments/create', body: {
      // TODO: поправить чтобы апи возвращал строку
      articleId: parseInt(store.getState().reader.currentId, 10),
      parentId: 0,
      text: input.value,
    }})
        .then(({status, response}) => new Promise((resolve, reject) => {
          if (status === Ajax.STATUS.ok) {
            resolve(response.data);
          } else {
            responseStatus = status;
            reject(new Error(response.msg));
          }
        }))
        .then((newComment) => {
          const comment = commentComponent({
            ...newComment,
            author: store.getState().authorization,
            datetime: getRusDateTime(
                translateServerDateToMS(newComment.dateTime),
            ),
          });
          const commentDiv = document.createElement('div');
          commentDiv.className = 'comments__comment';
          commentDiv.classList.add('comment');
          commentDiv.innerHTML = comment;
          answerOnComment(commentDiv);
          parent.appendChild(commentDiv);
        })
        .catch((err) => {
          if (responseStatus !== 0) {
            ModalTemplates.netOrServerError(responseStatus, err.message);
          } else {
            console.warn(err.message);
          }
        });
  }
}

/**
 * Показать комментарии
 */
function commentsShow() {
  let hide = true;
  const comments = document.querySelector('.comments');
  const showBtnText = document.querySelector('.comments-show__text');
  const arrow = document.querySelector('.comments-show__btn');

  if (arrow.classList.contains('rotate-180')) {
    showBtnText.innerText = 'Показать комментарии';
    arrow.classList.remove('rotate-180');
    hide = true;
  } else {
    showBtnText.innerText = 'Скрыть комментарии';
    arrow.classList.add('rotate-180');
    hide = false;
  }

  if (hide) {
    comments.classList.add('hide');
  } else {
    comments.classList.remove('hide');
  }
}

/**
 * Ответить на комментарий
 * @param {string} comment
 */
function answerOnComment(comment) {
  const answerBtn = comment.querySelector('.comment__answer-btn');
  answerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const answerFieldExist = comment
        .querySelector('.article-view__add-comment');

    if (!answerFieldExist) {
      const answerField = document.createElement('div');
      answerField.innerHTML = articleAddCommentComponent({});
      const answerBtn = answerField
          .querySelector('.article-view__send-comment-btn');
      answerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const answers = document.querySelector('.comment__answers');
        commentAdd(answers);
      });

      comment.appendChild(answerField);
    }
  });
}
