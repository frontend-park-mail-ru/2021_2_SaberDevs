import BaseComponent from '../_basic/baseComponent.js';
import ReaderView from './readerView.js';
import commentComponent from './comment.pug.js';
import articleAddCommentComponent from './articleAddComment.pug.js';

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
            this.root.querySelector('div.article-view__author > a').textContent;
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

    // обработчик добавления комментария
    const commentBtn = this.root
        .querySelector('.article-view__send-comment-btn');
    commentBtn.addEventListener('click', (e) => {
      e.preventDefault();
      commentAdd();
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
}

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
    const comments = document.querySelector('#comments');
    const commentDiv = commentAdd(comments);
    answerOnComment(commentDiv);
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
 * @return {HTMLDivElement}
 */
function commentAdd(parent) {
  const input = document.querySelector('.article-view__comment-input');
  if (input.value != '') {
    // пример добавления комментария
    const comment = commentComponent({
      avatarUrl: '../../static/img/users/user.jpg',
      firstName: 'Мое имя',
      likes: 0,
      text: input.value,
      datetime: '2021/11/22 12:36',
    });
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comments__comment';
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = comment;
    parent.appendChild(commentDiv);

    return commentDiv;
  }

  return '';
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
