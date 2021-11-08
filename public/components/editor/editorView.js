import BaseComponentView from '../_basic/baseComponentView.js';
import articleEditorComponent from '../reader/articleEditor.pug.js';
import formSettingsTextareaComponent from
  '../settings/formSettingsTextarea.pug.js';
import formSettingsRowComponent from
  '../settings/formSettingsRow.pug.js';

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
    const title = formSettingsRowComponent({
      label: 'Заголовок',
      type: 'text',
      name: 'title',
      placeholder: 'Введите заголовок статьи',
      pattern: '',
      value: '',
    });
    articleRows += title;
    const text = formSettingsTextareaComponent({
      label: 'Текст статьи',
      name: 'text',
      placeholder: '',
      value: '',
    });
    articleRows += text;

    const editor = document.createElement('div');
    editor.innerHTML = articleEditorComponent({
      form_rows: articleRows,
    });

    return editor.firstChild;
  }
}
