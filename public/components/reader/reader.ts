import BaseComponent from '../_basic/baseComponent';
import ReaderView from './readerView';
import commentComponent from './comment.pug.js';
import articleAddCommentComponent from './articleAddComment.pug.js';
import Likes from '../likes/likes';

import ModalTemplates from '../../components/modal/modalTemplates.js';
import Ajax from '../../modules/ajax';
import {translateServerComment} from '../../common/transformApi.js';
import {redirect} from '../../common/utils.js';

import store from '../../flux/store';
import {ReaderTypes, AuthorizationTypes} from '../../flux/types';
import readerActions from '../../flux/actions/readerActions';
import editorActions from '../../flux/actions/editorActions';

import {KeyElementsMapReader} from './ReaderView';
import {ReaderStateObject} from '../../flux/reducers/readerReducer';
import {Article, Comment, CommentWithAnswers} from '../../common/types';

type GetCommentsApiPayload = {
  id: number;
  comments: CommentWithAnswers[];
};

interface CommentAPI extends Comment {
  datetime: undefined,
}  

// true - поля ответа и изменения не убираются,
// игнорируется авторизация для комментариев
const layoutDebug = false;

/**
 * навесить обработчик на кнопку "изменить" комментарий
 *  сделать кнопку видиой
 * @param {HTMLElement} commentDiv - такой блок, в котором содержится дивак .comment__text
 * @param {Comment} comment
 */
function createCommentChangeListener(commentDiv: HTMLElement, comment: Comment) {
  const changeBtn = <HTMLElement> commentDiv.querySelector('.comment__edit-btn');
  changeBtn.style.display = 'block';
  changeBtn.addEventListener('click', (e: Event) => {
    e.preventDefault();
    // рисуем текстовое поле
    appendTextField(
        commentDiv,
        'изменение комментария',
        comment,
        false,
        (value: string) => {
          let responseStatus: number = 0;
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
              .then((newCommentSrv) => {
                const newComment: Comment = translateServerComment(
                    newCommentSrv,
                    store.getState().authorization,
                );
                store.dispatch(readerActions
                    .editArticleComment(comment.id, newComment.text),
                );
                const commentText = <HTMLElement | null> commentDiv.querySelector('.comment__text');
                if (!commentText) {
                  console.warn('Incomplete element: no inner \'.comment__text\' element');
                  return;
                }
                commentText.innerText = newComment.text;
              })
              .catch((err: Error) => {
                if (responseStatus !== 0) {
                  ModalTemplates
                      .netOrServerError(responseStatus, err.message);
                } else {
                  console.warn(err.message);
                }
              });
        });
  });
}

/**
 * навесить обработчик на кнопку "ответить" комментария
 * @param {HTMLElement} root
 * @param {number} articleId
 * @param {Comment} comment
 */
function createCommentAnswerListener(root: HTMLElement, articleId: number, comment: Comment) {
  // вешаем на кнопку "ответить" для самого комментария, и на всех его детей
  const answerBtns = <NodeListOf<HTMLElement>> root.querySelectorAll('.comment__answer-btn');
  answerBtns.forEach((el) => el.addEventListener('click', (e: Event) => {
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
        // articleId: parseInt(articleId, 10), // TODO: fix API
        articleId,
      }})
          .then(({status, response}) => new Promise((resolve, reject) => {
            if (status === Ajax.STATUS.ok) {
              resolve(response.data);
            } else {
              responseStatus = status;
              reject(new Error(response.msg));
            }
          }))
          .then((answerSrv: CommentAPI) => {
            const answerDiv = document.createElement('div');
            const answer: Comment = translateServerComment(answerSrv);
            answerDiv.innerHTML = <string> commentComponent(answer);

            // лайки
            const likesComponent = new Likes(
                1,
                answer.id,
                // TODO: check
                // parseInt(answer.id, 10),
                answer.likes,
                answer.liked,
                (id, sign, newLikesNum) => store.dispatch(readerActions.like(
                    id, sign, newLikesNum,
                )),
            );
            likesComponent.mountInPlace(answerDiv);

            // вешаем обработчики на только что созданный комментарий (ответ)
            createCommentChangeListener(answerDiv, answer);
            // поменял это
            // createCommentAnswerListener(answerDiv, articleId, answer);
            createCommentAnswerListener(answerDiv, articleId, comment);

            root.querySelector('.comment__answers').appendChild(answerDiv);
            store.dispatch(
                // какая-то путаница. parentId найти не получается
                readerActions.addAnswer(comment.id, answer),
            );
          })
          .catch((err: Error) => {
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
 * @param {Comment} comment
 * @param {boolean} isFieldClear
 * @param {Function} onClick
 */
function appendTextField(root: HTMLElement, message: string, comment: Comment, isFieldClear: boolean, onClick: (value: string) => void) {
  const answerFieldWrapper = document.createElement('div');
  answerFieldWrapper.innerHTML = <string> articleAddCommentComponent({message});
  const answerField = <HTMLDivElement> answerFieldWrapper.firstElementChild;
  const input = <HTMLInputElement> answerField.querySelector('input');
  if (!isFieldClear) {
    input.value = comment.text;
  }

  const submitAction = () => {
    const value = input.value.trim();
    // Если изменений нет или строка пустая
    if (value === comment.text || value === '') {
      return;
    }
    if (!checkRootsToComment()) {
      return;
    }

    input.value = '';

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

  const sendBtn = <HTMLElement> answerField.querySelector('.article-view__send-comment-btn');
  // клик по кнопке
  sendBtn.addEventListener('click', (e: Event) => {
    e.preventDefault();
    submitAction();
    input.focus();
  });
  // нажатие Enter
  input.addEventListener('keydown', ({keyCode, target}) => {
    if (keyCode === 13) {
      submitAction();
    }
  });
  root.appendChild(answerField);

  // даем фокус. при сбросе фокуса, удаляем поле. Но
  // поле не удаляется раньше,
  const focusOutListener = (e: Event) => {
    if (!layoutDebug) {
      root.removeChild(answerField);
    }
  };

  input.addEventListener('focusout', focusOutListener);

  sendBtn.addEventListener(
      'mouseover',
      (e: Event) => input.removeEventListener('focusout', focusOutListener),
  );
  sendBtn.addEventListener(
      'mouseout',
      (e: Event) => input.addEventListener('focusout', focusOutListener),
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
 * Добавление обработчиков
 * @param {Reader} reader - передать корневой элемент компонента
 */
function addEventListenersToReader(reader: Reader) {
  // переход на тег
  reader.root.querySelectorAll('.tags__tag').forEach((tag: HTMLElement) => {
    tag.addEventListener('click', (e: Event) => {
      e.preventDefault();
      redirect('/search?g=tags&q=' + tag.textContent);
    });
  });

  // переход на категорию
  reader.root.querySelector('.category__content').addEventListener('click', (e: Event) => {
    e.preventDefault();
    redirect('/categories/' + (<HTMLElement>e.currentTarget).textContent);
  });

  // обработчик: добавление комментария
  // нажатие Enter
  reader.root.querySelector('input')
      .addEventListener('keydown', ({key}) => {
        if (key === 'Enter') {
          if (!checkRootsToComment()) {
            return;
          }
          addCommentAction(reader);
        }
      });
  // клик по кнопке
  reader.root.querySelector('.article-view__send-comment-btn')
      .addEventListener('click', (e: Event) => {
        e.preventDefault();
        if (!checkRootsToComment()) {
          return;
        }
        addCommentAction(reader);
      });

  // обработчик: показать комментарии
  reader.keyElems.showCommentsBtn.addEventListener('click', (e: Event) => {
    e.preventDefault();
    commentsShowAction(reader);
  });
}

const editArticleAction = (e: Event) => {
  e.preventDefault();
  const state = store.getState().reader;
  const article = state[state.currentId];
  store.dispatch(editorActions.editArticle(article.id, article));
};

/**
 * Event-listener для добавление комментария
 * @param {Reader} reader
 */
function addCommentAction(reader: Reader) {
  const text = reader.keyElems.commentInput.value.trim();
  if (text !== '') {
    let responseStatus: number = 0;
    const articleId = store.getState().reader.currentId;
    Ajax.post({url: '/comments/create', body: {
      // number
      articleId,
      // articleId: parseInt(articleId, 10), // TODO: fix API
      parentId: 0,
      text,
    }})
        .then(({status, response}) => new Promise((resolve, reject) => {
          if (status === Ajax.STATUS.ok) {
            resolve(response.data);
          } else {
            responseStatus = status;
            reject(new Error(response.msg));
          }
        }))
        .then((newCommentSrv) => {
          reader.keyElems.commentInput.value = '';
          const newComment: Comment = translateServerComment(newCommentSrv);

          const commentWrapper = document.createElement('div');
          commentWrapper.innerHTML = <string> commentComponent(newComment);
          const commentDiv = <HTMLElement> commentWrapper.firstElementChild;

          // лайки
          const likesComponent = new Likes(
              1,
              newComment.id,
              // parseInt(newComment.id, 10), // TODO: fix API
              0,
              0,
              (id, sign, newLikesNum)=>store.dispatch(readerActions.likeComment(
                  id, sign, newLikesNum,
              )),
          );
          likesComponent.mountInPlace(commentDiv);

          // обработчики
          createCommentAnswerListener(commentDiv, articleId, newComment);
          createCommentChangeListener(commentDiv, newComment);

          store.dispatch(
              readerActions.addComment(newComment),
          );

          // TODO: check classNames
          // const commentsDiv = <HTMLElement> root.querySelector('.comments');
          // commentsDiv.appendChild(commentDiv);  // TODO: check classNames
          reader.keyElems.commentsBox.appendChild(commentDiv);

          // если это был первый комментарий, активируем кнопку "скрыть"
          // показываем кнопку "скрыть комментарии"
          // if (commentsDiv.childElementCount > 0) {  // TODO: check classNames
          if (reader.keyElems.commentsBox.childElementCount > 0) {
            reader.keyElems.showCommentsBtn.style.display = 'flex';
          }

          // переход к новому комментарию
          commentDiv.scrollIntoView();
        })
        .catch((err: Error) => {
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
 * @param {Reader} reader
 */
function commentsShowAction(reader: Reader) {
  let hide = true;
  const comments = <HTMLElement> reader.root.querySelector('.comments');
  const showBtnText = <HTMLElement> reader.root.querySelector('.comments-show__text');
  const arrow = <HTMLElement> reader.root.querySelector('.comments-show__btn');

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
function checkRootsToComment(): boolean {
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


/**
 * Компонент для чтения статей
 * @class Reader
 */
 export default class Reader extends BaseComponent {
  view: ReaderView;

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
        store.subscribe(ReaderTypes.OPEN_ARTICLE, (id: number) => {
          const state: ReaderStateObject = store.getState().reader;
          this.openArticle(state[id]);
        }),

        // Если подгрузили комментарии к текущей статье - отрисовать
        store.subscribe(ReaderTypes.SAVE_ARTICLE_COMMENTS, ({id, comments}: GetCommentsApiPayload) => {
          if (store.getState().reader.currentId === id) {
            this.setComments(comments);
          }
        }),

        // даем возможность редактирования если статья принадлежит пользователю
        // и комментов
        store.subscribe(AuthorizationTypes.LOGIN, () => {
          console.log('{Reader} Login reaction');
          
          if (!this.keyElems) {
            console.warn('{READER} component hasn\'t been rendered yet');
            return;
          }
          // Берем автора статьи по полю логина в верстке
          const author = this.keyElems.authorSign.textContent;
          if (author === store.getState().authorization.login) {
            this.keyElems.changeBtn.style.display = 'block';
            this.keyElems.changeBtn.href = '/editor';
            this.keyElems.changeBtn.addEventListener('click', editArticleAction);
          }

          // ререндерим комментари чтобы получить обработчики кнопок изменить
          const state = store.getState().reader;
          this.setComments(state[state.currentId].commentsContent);
        }),

        // забираем возможность изменения статьи, если пропадает авторизация
        store.subscribe(AuthorizationTypes.LOGOUT, () => {
          if (!this.keyElems) {
            console.warn('{READER} component hasn\'t been rendered yet');
            return;
          }
          this.keyElems.changeBtn.style.display = 'none';
          this.keyElems.changeBtn.href = undefined;
          this.keyElems.changeBtn.removeEventListener('click', editArticleAction);
        }),
    );
  }

  get keyElems(): KeyElementsMapReader {
    return this.view.keyElems;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();

    // TODO: оптимизировать, мб возвращать пустой дивак
    const state: ReaderStateObject = store.getState().reader;
    this.root = this.view.render(state[state.currentId]);

    if (!this.keyElems) {
      return document.createElement('div');
    }

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

    addEventListenersToReader(this);

    // пока контент статьи не прогрузился, изменять статью не даем
    return this.root;
  }

  /**
    * Задать содержание статьи
    * @param {Article} article
    */
  openArticle(article: Article) {
    this.root.innerHTML = '';
    this.view.keyElems = null;
    // this.root = this.view.render(article);

    // // проверять нужно, т.к. openArticle может быть
    // // вызван до 
    // if (!this.keyElems) {
    //   return document.createElement('div');
    // }
    // нет смысла проверять
    // this.view.render(article).childNodes.forEach((node) => {
    //   this.root.appendChild(node.cloneNode(true));
    // });

    this.render();
    // обработчики
    // addEventListenersToReader(this.root);

    // лайки
    const likesComponent = new Likes(
        0,
        <number> article.id,
        article.likes,
        article.liked,
        (id, sign, newLikesNum) => store.dispatch(readerActions.like(
            id, sign, newLikesNum,
        )),
    );
    likesComponent.mountInPlace(this.root);

    // активация кнопки изменения статьи, если статья принадлежит пользователю
    const authLogin = store.getState().authorization.login;
    if (article.author.login === authLogin) {
      this.keyElems.changeBtn.style.display = 'block';
      this.keyElems.changeBtn.href = '/editor';
      this.keyElems.changeBtn.addEventListener('click', editArticleAction);
    }
  }

  /**
   * Отрендерить комментарии при их загрузке
   * @param {Array<Comment>} comments
   */
  setComments(comments: CommentWithAnswers[]) {
    if (!this.keyElems) {
      console.warn(
        '{Reader} component hasn\'t been rendered yet',
      );
      return;
    }

    this.keyElems.commentsBox.innerHTML = '';

    // показываем кнопку "скрыть комментарии"
    if (comments.length > 0) {
      this.keyElems.showCommentsBtn.style.display = 'flex';
    }

    comments.forEach((comment: CommentWithAnswers) => {
      const commentWrapper = document.createElement('div');
      let answers: string = '';

      // подготовка ответов на комментарий
      comment.answers.forEach((element: Comment) => {
        if ('answers' in element) {
          console.warn('Не должно быть вложенности более 1');
          delete (<CommentWithAnswers>element).answers;
        }
        answers += <string> commentComponent(element);
      });

      // отрисовка
      commentWrapper.innerHTML = <string> commentComponent({
        ...comment,
        answers,
      });
      const commentDiv = <HTMLElement> commentWrapper.firstElementChild;

      // лайки
      const likesComponent = new Likes(
          1,
          comment.id,
          // parseInt(comment.id, 10), // TODO: fix API
          comment.likes,
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
          .querySelectorAll('.comment')
          .forEach((element: HTMLElement) => {
            // информация о текущем перебираемом комментарии
            const elementComment =
                comment.answers.find((el) => (el.id + '') === element.id);
            // если ответ принадлежит авторизованному пользователю,
            // активируем изменить
            if (element.dataset.author === authLogin) {
              createCommentChangeListener(element, elementComment);
            }
            // лайки
            const likesComponent = new Likes(
                1,
                elementComment.id,
                // parseInt(elementComment.id, 10), // TODO: fix API
                elementComment.likes,
                elementComment.liked,
                (id, sign, newLikesNum) => store.dispatch(
                    readerActions.likeComment(id, sign, newLikesNum),
                ),
            );
            likesComponent.mountInPlace(element);
          });
      this.keyElems.commentsBox.appendChild(commentDiv);
    });
  }
}
