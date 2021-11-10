import BaseComponent from '../_basic/baseComponent.js';
import EditorView from './editorView.js';

import store from '../../flux/store.js';
import editorActions from '../../flux/actions/editorActions.js';
import {editorTypes} from '../../flux/types.js';

import Ajax from '../../modules/ajax.js';
import {redirect} from '../../utils.js';

import Modal from '../modal/modal.js';
import signupModal from '../modal/signupModal.js';

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
    const state = store.getState().editor;
    this.setContent(state[state.currentId]);
    if (typeof state.currentId === 'string' && state.currentId !== '0' ||
        typeof state.currentId === 'number' && state.currentId !== 0) {
      this.changeToUpdate();
    }

    this.root.querySelector('.article-create__add-tag').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          // TODO: теги
        },
    );

    // TODO: проверить, рейзится ли евент, если textValue меняется программой
    this.root.querySelector('textarea').addEventListener('change', (e) => {
      const title = this.root.querySelector('input[name="title"]').value;
      const text = this.root.querySelector('textarea').value;
      store.dispatch(editorActions.saveArticle(
          store.getState().editor.currentId, {
            title,
            text,
          },
      ));
    });

    this.root.querySelector('.article-create__del-btn').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          Modal.configurate({
            title: 'Точно хотите удалить?',
            content: 'Продолжив, вы удалите статью',
            isEnteractive: true,
            onConfirm: () => {
              Ajax.post({
                url: `/articles/delete?id=${store.getState().editor.currentId}`,
                body: {},
              }).then(({status, response}) => {
                if (status === Ajax.STATUS.ok) {
                  store.dispatch(editorActions.deleteArticle(
                      store.getState().editor.currentId,
                  ));
                  Modal.setTitle('Успех!');
                  Modal.setContent('Статья была удалена');
                  Modal.open(false);
                  setTimeout(() => redirect('/profile'), Modal.animationTime);
                  return;
                }
                if (status === Ajax.STATUS.invalidSession) {
                  signupModal(false);
                  return;
                }
                // В случае ошибки
                if (status / 100 === 5) {
                  Modal.setTitle(`Сервис временно не доступен: ${status}`);
                }
                if (status / 100 === 4) {
                  Modal.setTitle(/* пользовательская */`Ошибка ${status}`);
                }
                Modal.setContent(response.msg);
                Modal.open(false);
              });
            }});
          Modal.open();
        },
    );

    this.root.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();

      const text = this.root.querySelector('textarea')?.value;
      const title = this.root.querySelector('input[name="title"]')?.value;
      if (!text || !title || text.trim() === '' || title.trim() === '') {
        console.warn('{Editor} пустые статьи - это плохо:', {text}, {title});
        Modal.setTitle('Ошибка');
        Modal.setContent('Заголовок и текст статьи не должны быть пустыми');
        Modal.open(false);
      }

      const state = store.getState().editor;
      const isUpdate =
          typeof state.currentId === 'string' && state.currentId !== '0' ||
          typeof state.currentId === 'number' && state.currentId !== 0;

      const body = {
        title,
        text,
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
          store.dispatch(editorActions.publishArticle(response.data.id));
          Modal.setTitle('Успех!');
          Modal.setContent(`Статья успешно ${isUpdate?'изменена' : 'создана'}`);
          Modal.open(false);
          setTimeout(
              () => redirect(`/article/${response.data.id}`),
              Modal.animationTime,
          );
          return;
        }
        if (status === Ajax.STATUS.invalidSession) {
          signupModal(false);
          return;
        }

        // В случае ошибки
        if (status / 100 === 5) {
          Modal.setTitle(`Сервис временно не доступен: ${status}`);
        }
        if (status / 100 === 4) {
          Modal.setTitle(/* пользовательская */`Ошибка ${status}`);
        }
        Modal.setContent(response.msg);
        Modal.open(false);
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
    this.root.querySelector('input[name="btn-submit"]').value = 'Создать';
    this.root.querySelector('.article-create__title').textContent =
      'Создание статьи';
    this.root.querySelector('.article-create__del-btn').style.display = 'none';
  }

  /**
   * Поменять надписи на "Изменение"
   */
  changeToUpdate() {
    this.root.querySelector('input[name="btn-submit"]').value = 'Изменить';
    this.root.querySelector('.article-create__title').textContent =
      'Изменение статьи';
    this.root.querySelector('.article-create__del-btn').style.display = 'flex';
  }
}
