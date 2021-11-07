import BaseComponent from '../_basic/baseComponent.js';
import EditorView from './editorView.js';

import store from '../../flux/store.js';
import editorActions from '../../flux/actions/editorActions.js';
import {editorTypes} from '../../flux/types.js';
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
          this.setContent(store.getState().editor[0]);
        }),
        store.subscribe(editorTypes.EDIT_EXISTING_ARTICLE, ({id}) => {
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

    // проверить, рейзится ли евент, если textValue меняется программой
    this.root.querySelector('textarea').addEventListener('change', (e) => {
      e.preventDefault();
      const title = this.root.querySelector('input[name="title"]').textContent;
      const content = this.root.querySelector('textarea').textContent;
      store.dispatch(editorActions.saveArticle(store.getState().currentId, {
        title,
        content,
      }));
    });

    return this.root;
  }

  /**
    * Перерисовать главную страницу
    * @param {Object?} existingArticle
    * @property {string} title
    * @property {string} content
    * @property {Array<string>?} tags
    * @property {number?} time
    * @property {string?} author
    * @property {number?} likes
    * @property {number?} comments
    */
  setContent({title, content}) {
    if (title || content) {
      console.log('{EDITOR} set content');
    }
    const textarea = this.root.querySelector('textarea');
    const titleInput = this.root.querySelector('input[name="title"]');
    if (textarea === null || titleInput === null) {
      console.warn('{Editor} component hasn\'t been rendered yet');
    }
    textarea.textContent = content;
    titleInput.value = title;
  }

  /**
   * сбросить value форм
   */
  clear() {
    console.log('{EDITOR} clear');
    this.setContent({
      title: '',
      content: '',
    });
  }
}
