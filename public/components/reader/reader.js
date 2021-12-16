import BaseComponent from '../_basic/baseComponent.js';
import ReaderView from './readerView.js';
import commentComponent from './comment.pug.js';
import articleAddCommentComponent from './articleAddComment.pug.js';
import Likes from '../likes/likes.js';

import ModalTemplates from '../../components/modal/modalTemplates.js';

import Ajax from '../../modules/ajax.js';

import store from '../../flux/store.js';
import {readerTypes, authorizationTypes} from '../../flux/types.js';
import readerActions from '../../flux/actions/readerActions.js';
import editorActions from '../../flux/actions/editorActions.js';

// true - поля ответа и изменения не убираются,
// игнорируется авторизация для комментариев
const layoutDebug = false;

/**
 * навесить обработчик на кнопку "изменить" комментарий
 *  сделать кнопку видиой
 * @param {HTMLElement} commentDiv
 * @param {Comment} comment
 */
function createCommentChangeListener(commentDiv, comment) {
  const changeBtn = commentDiv.querySelector('.comment__edit-btn');
  changeBtn.style.display = 'block';
  changeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // рисуем текстовое поле
    appendTextField(
        commentDiv,
        'изменение комментария',
        comment,
        false,
        (value) => {
          let responseStatus = 0;
          Ajax.post({url: '/comments/update', body: {
            text: value,
            id: comment.id,  // number
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
                newComment = translateServerComment(
                    newComment,
                    store.getState().authorization,
                );
                commentDiv.innerHTML = commentComponent(newComment);
                store.dispatch(readerActions
                    .editArticleComment(comment.id, newComment.text),
                );
              })
              .catch((err) => {
                if (responseStatus !== 0) {
                  ModalTemplates
                      .netOrServerError(responseStatus, err.message);
                } else {
                  console.warn(err.message);
                }
              });
          // TODO: перейти на якорь добавленного коммента
        });
  });
}

/**
 * навесить обработчик на кнопку "ответить" комментария
 * @param {HTMLElement} root
 * @param {number | string} articleId
 * @param {Comment} comment
 */
function createCommentAnswerListener(root, articleId, comment) {
  // вешаем на кнопку "ответить" для самого комментария, и на всех его детей
  const answerBtns = root.querySelectorAll('.comment__answer-btn');
  answerBtns.forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();

    // проверяем авторизацию
    if (!checkRootsToComment()) {
      return;
    }

    // рисуем чистое текстовое поле
    appendTextField(root, 'ответ на комментарий', comment, true, (value) => {
      let responseStatus = 0;
      Ajax.post({url: '/comments/create', body: {
        text: value,
        parentId: comment.id,  // number
        articleId: parseInt(articleId, 10),
      }})
          .then(({status, response}) => new Promise((resolve, reject) => {
            if (status === Ajax.STATUS.ok) {
              resolve(response.data);
            } else {
              responseStatus = status;
              reject(new Error(response.msg));
            }
          }))
          .then((answer) => {
            const answerDiv = document.createElement('div');
            answer = translateServerComment(answer);
            answerDiv.innerHTML = commentComponent(answer);

            // вешаем обработчики на только что созданный комментарий (ответ)
            createCommentChangeListener(answerDiv, answer);
            createCommentAnswerListener(answerDiv, articleId, answer);

            root.querySelector('.comment__answers').appendChild(answerDiv);
            store.dispatch(
                readerActions.addAnswer(comment.id, answer),
            );
          })
          .catch((err) => {
            if (responseStatus !== 0) {
              ModalTemplates
                  .netOrServerError(responseStatus, err.message);
            } else {
              console.warn(err.message);
            }
          });
    });
  }));
}

/**
 * Отрисовать текстовое поле с обработчиком
 * @param {HTMLElement} root вниз будет вставлен инпут со стрелочкой
 * @param {string} message
 * @param {object} comment
 * @param {boolean} isFieldClear
 * @param {function} onClick
 */
function appendTextField(root, message, comment, isFieldClear, onClick) {
  const answerFieldWrapper = document.createElement('div');
  answerFieldWrapper.innerHTML = articleAddCommentComponent({message});
  const answerField = answerFieldWrapper.firstChild;
  answerField.classList.add('comment-answer-input');
  const input = answerField.querySelector('input');
  if (!isFieldClear) {
    input.value = comment.text;
  }

  const submitAction = () => {
    const value = input.value.trim();
    // Если изменений нет или строка пустая
    if (value === comment.text || value === '') {
      return;
    }
    onClick(value);
    // мог быть уже убран если сработал focusout
    // focusout отключен, если нажимается кнопка
    try {
      if (!layoutDebug) {
        root.removeChild(answerField);
      }
    } catch {
      // пофиг если често
    }
  };

  const sendBtn = answerField.querySelector('.article-view__send-comment-btn');

  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitAction();
  });
  root.appendChild(answerField);

  // даем фокус. при сбросе фокуса, удаляем поле. Но
  // поле не удаляется раньше,
  const focusOutListener = (e) => {
    if (!layoutDebug) {
      root.removeChild(answerField);
    }
  };

  input.addEventListener('focusout', focusOutListener);

  sendBtn.addEventListener(
      'mouseover',
      (e) => input.removeEventListener('focusout', focusOutListener),
  );
  sendBtn.addEventListener(
      'mouseout',
      (e) => input.addEventListener('focusout', focusOutListener),
  );

  // сабмит нажатием enter
  input.addEventListener('keydown', ({keyCode, target}) => {
    if (keyCode === 13) {
      submitAction();
    }
  });

  input.focus();
}

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
        // и комментов
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
            articleChangeBtn.addEventListener('click', editArticleAction);
          }

          // ререндерим комментари чтобы получить обработчики кнопок изменить
          const state = store.getState().reader;
          this.setComments(state[state.currentId].commentsContent);
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
          articleChangeBtn.removeEventListener('click', editArticleAction);
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

    // при первом рендере стейт может быть пустым!!!
    //
    // const likesComponent = new Likes(
    //     0,
    //     parseInt(state[state.currentId]?.id || 0, 10),
    //     state[state.currentId].likes,
    //     state[state.currentId].liked,
    //     (id, sign, newLikesNum) => store.dispatch(readerActions.like(
    //         id, sign, newLikesNum,
    //     )),
    // );
    // likesComponent.mountInPlace(this.root);

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

    // лайки
    const likesComponent = new Likes(
        0,
        parseInt(article.id, 10),
        article.likes,
        article.liked,
        (id, sign, newLikesNum) => store.dispatch(readerActions.like(
            id, sign, newLikesNum,
        )),
    );
    likesComponent.mountInPlace(this.root);

    // обработчики
    addEventListenersToReader(this.root);

    const authLogin = store.getState().authorization.login;
    if (article.author.login === authLogin) {
      const articleChangeBtn = this.root.querySelector('#article-change-btn');
      articleChangeBtn.style.display = 'block';
      articleChangeBtn.href = '/editor';
      articleChangeBtn.addEventListener('click', editArticleAction);
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
    const commentsDiv = this.root.querySelector('[data-inplace="comments"]');
    commentsDiv.innerHTML = '';

    // показываем кнопку "скрыть комментарии"
    if (comments.length > 0) {
      this.root.querySelector('.comments-show').style.display = 'flex';
    }

    comments.forEach((comment) => {
      const commentWrapper = document.createElement('div');
      let answers = '';

      // подготовка ответов на комментарий
      comment.answers.forEach((element) => {
        if ('answers' in element) {
          console.warn('Не должно быть вложенности более 1');
          delete element.answers;
        }
        answers += commentComponent(element);
      });

      // отрисовка
      commentWrapper.innerHTML = commentComponent({
        ...comment,
        answers,
      });
      const commentDiv = commentWrapper.firstChild;

      // лайки
      const likesComponent = new Likes(
          1,
          parseInt(comment.id, 10),
          comment.likes,
          // TODO: починить API
          comment.liked,
          (id, sign, newLikesNum) => store.dispatch(readerActions.likeComment(
              id, sign, newLikesNum,
          )),
      );
      likesComponent.mountInPlace(commentDiv);

      // активируем кнопку "ответить"
      createCommentAnswerListener(
          commentDiv,
          store.getState().reader.currentId,
          comment,
      );

      // активируем кнопку изменения у комментариев, принадлежащих
      // текущему юзеру;
      const authLogin = store.getState().authorization.login;
      if (authLogin === comment.author.login || layoutDebug) {
        createCommentChangeListener(commentDiv, comment);
      }
      // то же с ответами
      commentDiv.querySelector('.comment__answers')
          .querySelectorAll(layoutDebug ? '.comment' :
              `div[data-author="${authLogin}"]`)
          .forEach((element) => {
            const elementComment =
                comment.answers.filter((el) => (el.id + '') === element.id)[0];
            createCommentChangeListener(element, elementComment);
          });
      commentsDiv.appendChild(commentDiv);
    });
  }
}

/**
 * Добавление обработчиков
 * @param {HTMLDivElement} root
 */
function addEventListenersToReader(root) {
  // переход на тег
  // TODO: красивые теги / сейчас ссылка в шаблоне
  // root.querySelectorAll('.article-view__tag').forEach((tag) => {
  //   // TODO: search parameters from url
  //   tag.href = '/categories';
  // });

  // переход на категорию
  // TODO: красивые категории / сейчас ссылка в шаблоне
  // root.querySelectorAll('.article-view__tag').forEach((tag) => {
  //   // TODO: search parameters from url
  //   tag.href = '/categories';
  // });

  // обработчик: добавление комментария
  const commentBtn = root
      .querySelector('.article-view__send-comment-btn');
  commentBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!checkRootsToComment()) {
      return;
    }
    addCommentAction(root);
  });

  // обработчик: показать комментарии
  const btnShow = root
      .querySelector('.comments-show');
  btnShow.addEventListener('click', (e) => {
    e.preventDefault();
    commentsShowAction(root);
  });
}

const editArticleAction = (e) => {
  e.preventDefault();
  const state = store.getState().reader;
  const article = state[state.currentId];
  store.dispatch(editorActions.editArticle(article.id, article));
};

/**
 * Добавление комментария
 * визуал + обработчики
 * @param {Element} root
 */
function addCommentAction(root) {
  const input = root.querySelector('input.article-view__comment-input');
  if (input.value.trim() != '') {
    let responseStatus = 0;
    const articleId = store.getState().reader.currentId;
    Ajax.post({url: '/comments/create', body: {
      // number
      articleId: parseInt(articleId, 10),
      parentId: 0,
      text: input.value.trim(),
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
          newComment = translateServerComment(newComment);

          const commentWrapper = document.createElement('div');
          commentWrapper.innerHTML = commentComponent(newComment);
          const commentDiv = commentWrapper.firstChild;
          // обработчики
          createCommentAnswerListener(commentDiv, articleId, newComment);
          createCommentChangeListener(commentDiv, newComment);

          store.dispatch(
              readerActions.addComment(newComment),
          );

          const commentsDiv = root.querySelector('.comments');
          commentsDiv.appendChild(commentDiv);

          // если это был первый комментарий, активируем кнопку "скрыть"
          // показываем кнопку "скрыть комментарии"
          if (commentsDiv.childElementCount > 0) {
            root.querySelector('comments-show').style.display = 'block';
          }
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
 * @param {Element} root
 */
function commentsShowAction(root) {
  let hide = true;
  const comments = root.querySelector('.comments');
  const showBtnText = root.querySelector('.comments-show__text');
  const arrow = root.querySelector('.comments-show__btn');

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
    const delay = 550;
    setTimeout(() => comments.style.position = 'absolute', delay);
  } else {
    comments.style.position = 'relative';
    comments.classList.remove('hide');
  }
}

/**
 * Проверяет авторизацию и наличие имени / фамилии
 * у пользователя
 * возвращает true, если права на добавление
 * комментариев есть, иначе выводит модалку
 * @return {boolean}
 */
function checkRootsToComment() {
  if (!store.getState().authorization.isAuthenticated) {
    ModalTemplates.signup(false);
    return false;
  }

  if (!store.getState().authorization.firstName ||
      !store.getState().authorization.lastName) {
    ModalTemplates.needFullRegConfirm(
        'Пользователи, не указавшие имя и фамилию, не могут оставлять' +
        ' комментарии.',
        '',
    );
    return false;
  }

  return true;
}
