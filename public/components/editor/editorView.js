import BaseComponentView from '../_basic/baseComponentView.js';
import articleEditorComponent from '../editor/articleEditor.pug.js';
import formArticleEditorTextareaComponent from
  '../editor/formArticleEditorTextarea.pug.js';
import formArticleEditorRowComponent from
  '../editor/formArticleEditorRow.pug.js';
import tagComponent from './tag.pug.js';
import {genRanHexColor} from '../../common/utils.js';

/**
 * @class EditorView
 */
export default class EditorView extends BaseComponentView {
  /**
   * Компонент редактора
   */
  constructor() {
    super();
    this.tagBox = document.createElement('div');
  }

  /**
   * @return {HTMLElement}
   */
  render() {
    let articleRows = '';
    const title = formArticleEditorRowComponent({
      label: 'Заголовок',
      type: 'text',
      name: 'title',
    });
    articleRows += title;
    const text = formArticleEditorTextareaComponent({
      label: 'Текст статьи',
      name: 'text',
    });
    articleRows += text;

    const editor = document.createElement('div');
    editor.innerHTML = articleEditorComponent({
      pageName: 'Создание статьи',
      buttonAction: 'clear',
      form_rows: articleRows,
    });

    this.tagBox = editor.firstChild.querySelector('.article-create__tags');
    return editor.firstChild;
  }

  /**
   * Добавляет тег вниз страницы
   * @param {string} tag
   * @param {function} deleteAction
   */
  appendTag(tag, deleteAction) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = tagComponent({
      content: tag,
      color: genRanHexColor(),
      cross: true,
    });
    const tagDiv = wrapper.firstChild;
    tagDiv.querySelector('.tags__tag__del-btn').addEventListener(
        'click',
        (e) => {
          deleteAction();
          tagDiv.remove();
        });
    this.tagBox.appendChild(tagDiv);
  }

  /**
   * Стираем все выбранные теги со страницы
   */
  clearTags() {
    this.tagBox.innerHTML = '';
  }
}
