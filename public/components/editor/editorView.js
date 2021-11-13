import BaseComponentView from '../_basic/baseComponentView.js';
import articleEditorComponent from '../editor/articleEditor.pug.js';
import formArticleEditorTextareaComponent from
  '../editor/formArticleEditorTextarea.pug.js';
import formArticleEditorRowComponent from
  '../editor/formArticleEditorRow.pug.js';
// import {genRanHex} from '../../common/utils.js';

/**
 * @class EditorView
 */
export default class EditorView extends BaseComponentView {
  /**
   * Компонент редактора
   */
  constructor() {
    super();
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
    return editor.firstChild;
  }
}
