import BaseComponentView from '../_basic/baseComponentView.js';
import articleEditorComponent from '../editor/articleEditor.pug.js';
import formSettingsTextareaComponent from
  '../settings/formSettingsTextarea.pug.js';
import formSettingsRowComponent from
  '../settings/formSettingsRow.pug.js';
import {genRanHex} from '../../utils.js';

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
    });
    articleRows += title;
    const text = formSettingsTextareaComponent({
      label: 'Текст статьи',
      name: 'text',
    });
    articleRows += text;

    const editor = document.createElement('div');
    editor.innerHTML = articleEditorComponent({
      form_rows: articleRows,
    });

    // TODO: tag selector component
    const addTag = editor.getElementsByClassName('article-create__add-tag')[0];
    addTag?.addEventListener('click', (e) => {
      e.preventDefault();
      const tags = document.getElementsByClassName('article-create__tags')[0];
      const inputTag =
        document.getElementsByClassName('article-create__input-tag')[0];
      if (inputTag.value.trim() != '') {
        const tagDiv = document.createElement('div');
        tagDiv.className = 'tags__tag';
        tagDiv.innerHTML = inputTag.value;
        tagDiv.style.color = 'white';
        tagDiv.style.backgroundColor = '#' + genRanHex();
        tagDiv.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('[click tag]');
          if (tagDiv.classList.contains('tags__tag_clicked')) {
            tagDiv.classList.remove('tags__tag_clicked');
          } else {
            tagDiv.classList.add('tags__tag_clicked');
          }
        });
        tags.appendChild(tagDiv);
      }
    });

    const deleteBtn =
            editor.getElementsByClassName('action-btns__trash-icon')[0];
    deleteBtn?.addEventListener('click', (e) => {
      console.log('[click delete]');
      e.preventDefault();
      const clickTags = document.getElementsByClassName('tags__tag_clicked');
      for (const tag of clickTags) {
        tag.remove();
      }
    });

    return editor.firstChild;
  }
}
