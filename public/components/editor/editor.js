import BaseComponent from '../_basic/baseComponent.js';
import EditorView from './editorView.js';

import store from '../../flux/store.js';
import editorActions from '../../flux/actions/editorActions.js';
import {editorTypes} from '../../flux/types.js';

import Ajax from '../../modules/ajax.js';
import {redirect} from '../../utils.js';
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

    // TODO: проверить, рейзится ли евент, если textValue меняется программой
    this.root.querySelector('textarea').addEventListener('change', (e) => {
      e.preventDefault();
      const title = this.root.querySelector('input[name="title"]').value;
      const content = this.root.querySelector('textarea').textContent;
      store.dispatch(editorActions.saveArticle(store.getState().currentId, {
        title,
        content,
      }));
    });

    this.root.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();

      const text = this.root.querySelector('textarea')?.textContent;
      const title = this.root.querySelector('input[name="title"]')?.value;
      if (!text || !title) {
        console.warn('{Editor} пустые статьи - это плохо:', {text}, {title});
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
          store.dispatch(editorActions.publishArticle(response.id));
          redirect('/profile');
        }
        // TODO: если кука сгорела, сервер вернул unauthorized
        // редирект на авторизацию
        // Вывести предупреждение о том, что стейт сохранен,
        // и чтобы не перезапускали страницу
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
    this.root.querySelector('.article-create__del-btn').textContent= 'Очистить';
  }

  /**
   * Поменять надписи на "Изменение"
   */
  changeToUpdate() {
    this.root.querySelector('input[name="btn-submit"]').value = 'Изменить';
    this.root.querySelector('.article-create__title').textContent =
      'Изменение статьи';
    this.root.querySelector('.article-create__del-btn').textContent= 'Удалить';
  }
}
