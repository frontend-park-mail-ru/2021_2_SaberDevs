import BaseComponent from '../_basic/baseComponent.js';
import EditorView from './editorView.js';

import store from '../../flux/store.js';
import editorActions from '../../flux/actions/editorActions.js';
import {authorizationActions} from '../../flux/actions.js';
import {editorTypes} from '../../flux/types.js';

import Ajax from '../../modules/ajax.js';
import {redirect} from '../../common/utils.js';

import ModalTemplates from '../modal/modalTemplates.js';

/**
   * Проверяет состояние editor
   * @return {boolean}
   */
function isUpdateFromState() {
  const state = store.getState().editor;
  return typeof state.currentId === 'string' && state.currentId !== '0' ||
         typeof state.currentId === 'number' && state.currentId !== 0;
}

/**
 * Компонент редактора статей
 * @class Editor
 */
export default class Editor extends BaseComponent {
  /**
   * Окошко сообщений о состоянии сервиса
   */
  constructor() {
    super();
    this.view = new EditorView();

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    this.unsubscribes.push(
        store.subscribe(editorTypes.CLEAR_ARTICLE, () => {
          this.clear();
        }),
        store.subscribe(editorTypes.PUBLISH_ARTICLE, () => {
          this.clear();
        }),
        store.subscribe(editorTypes.CREATE_ARTICLE, () => {
          this.changeToCreate();
          this.setContent(store.getState().editor[0]);
        }),
        store.subscribe(editorTypes.EDIT_EXISTING_ARTICLE, ({id}) => {
          this.changeToUpdate();
          this.setContent(store.getState().editor[id]);
        }),
    );
  }


  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();

    // Проверяем, было ли вызвано событие EDIT_EXISTING_ARTICLE
    // до рендера. Если было, то в сторе есть изменения.
    // Проверяем, что стор неинициализирован. такое бывает, если перешли
    // в редактор по урлу. Должен быть редирект на логин
    if (!store.getState().editor[store.getState().editor.currentId]) {
      store.dispatch(editorActions.createArticle());
    }
    const state = store.getState().editor;
    this.setContent(state[state.currentId]);
    if (typeof state.currentId === 'string' && state.currentId !== '0' ||
        typeof state.currentId === 'number' && state.currentId !== 0) {
      this.changeToUpdate();
    } else {
      this.changeToCreate();
    }

    // //////////////////////////////////
    //
    //          Обработчики
    //
    // //////////////////////////////////

    // кнопка добавления тега
    const tagInput = this.root.querySelector('input.article-create__input-tag');
    this.root.querySelector('.article-create__add-tag').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          // TODO: теги
          const tag = tagInput.value.trim();
          tag.replace(/\s+/, '_');
        },
    );

    // Сохранение введенного пользователем текста onChange
    // TODO: проверить, рейзится ли евент, если textValue меняется программой
    this.root.querySelector('textarea').addEventListener('change', (e) => {
      const title = this.root.querySelector('input[name="title"]').value;
      const text = this.root.querySelector('textarea').value;
      store.dispatch(editorActions.saveArticle(
          store.getState().editor.currentId, {title, text},
      ));
    });

    // удаление статьи
    this.root.querySelector('.article-create__clear-btn').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          ModalTemplates.confirm(
              'Вы собираетесь очистить то, что написали',
              'Продолжив, вы сотрете все',
              () => {
                this.clear();
              });
        });

    // удаление статьи
    this.root.querySelector('.article-create__del-btn').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          ModalTemplates.confirm(
              'Точно хотите удалить?',
              'Продолжив, вы удалите статью',
              () => {
                Ajax.post({
                  url:
                    `/articles/delete?id=${store.getState().editor.currentId}`,
                  body: {},
                }).then(({status, response}) => {
                  if (status === Ajax.STATUS.ok) {
                    store.dispatch(editorActions.deleteArticle(
                        store.getState().editor.currentId,
                    ));
                    ModalTemplates.
                        informativeMsg('Успех!', 'Статья была удалена');
                    redirect('/profile');
                    return;
                  }
                  if (status === Ajax.STATUS.invalidSession) {
                    store.dispatch(authorizationActions.logout());
                    ModalTemplates.signup(false);
                    return;
                  }
                  // В случае ошибки
                  ModalTemplates.netOrServerError(status, response.msg);
                });
              });
        },
    );

    // сабмит формы
    this.root.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();

      const text = this.root.querySelector('textarea')?.value.trim();
      const title= this.root.querySelector('input[name="title"]')?.value.trim();
      if (!text || !title || text === '' || title === '') {
        console.warn('{Editor} пустые статьи - это плохо:', {text}, {title});
        ModalTemplates.informativeMsg(
            'Ошибка', 'Заголовок и текст статьи не должны быть пустыми',
        );
        return;
      }

      const state = store.getState().editor;
      const isUpdate = isUpdateFromState();

      const body = {
        title,
        text,
        category: '',
        img: '',
        tags: state.tags,
      };
      if (isUpdate) {
        Object.assign(body, {id: state.currentId});
      }

      Ajax.post({
        url: `/articles/${isUpdate ? 'update' : 'create'}`,
        body,
      }).then(({status, response}) => {
        if (status === Ajax.STATUS.ok) {
          store.dispatch(editorActions.publishArticle(response.data));
          ModalTemplates.informativeMsg(
              'Успех!', `Статья успешно ${isUpdate?'изменена' : 'создана'}`,
          );
          redirect(`/article/${response.data}`);
          return;
        }
        if (status === Ajax.STATUS.invalidSession) {
          store.dispatch(authorizationActions.logout());
          ModalTemplates.signup(false);
          return;
        }

        // В случае ошибки
        ModalTemplates.netOrServerError(status, response.msg);
      });
    });
    return this.root;
  }

  /**
    * Перерисовать главную страницу
    * @param {Object?} existingArticle
    * @property {string} title
    * @property {string} text
    * @property {Array<string>?} tags
    * @property {number?} time
    * @property {string?} author
    * @property {number?} likes
    * @property {number?} comments
    */
  setContent({title, text}) {
    if (title || text) {
      console.log('{EDITOR} set content');
    }
    const textarea = this.root.querySelector('textarea');
    const titleInput = this.root.querySelector('input[name="title"]');
    if (textarea === null || titleInput === null) {
      console.warn(
          '{Editor} can\'t use setContent: component hasn\'t been rendered yet',
      );
      return;
    }
    textarea.textContent = text;
    titleInput.value = title;
  }

  /**
   * сбросить value форм
   */
  clear() {
    console.log('{EDITOR} clear');
    this.setContent({
      title: '',
      text: '',
    });
  }

  /**
   * Поменять надписи на "Создание"
   */
  changeToCreate() {
    const submitBtn = this.root.querySelector('input[name="btn-submit"]');
    if (!submitBtn) {
      console.warn(
          `{Editor} can\'t use changeToCreate:
          component hasn\'t been rendered yet`,
      );
      return;
    }
    submitBtn.value = 'Создать';
    this.root.querySelector('.article-create__title').textContent =
      'Создание статьи';
    this.root.querySelector('.article-create__del-btn').style.display = 'none';
  }

  /**
   * Поменять надписи на "Изменение"
   */
  changeToUpdate() {
    const submitBtn = this.root.querySelector('input[name="btn-submit"]');
    if (!submitBtn) {
      console.warn(
          `{Editor} can\'t use changeToCreate:
          component hasn\'t been rendered yet`,
      );
      return;
    }
    submitBtn.value = 'Изменить';
    this.root.querySelector('.article-create__title').textContent =
      'Изменение статьи';
    this.root.querySelector('.article-create__del-btn').style.display = 'flex';
  }
}
