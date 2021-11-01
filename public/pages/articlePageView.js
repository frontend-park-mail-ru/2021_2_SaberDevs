import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import {genRanHex} from '../utils.js';

// ///////////////////////////////// //
//
//              Article Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - редактор статьи.
 * @class ArticlePageView
 */
export default class ArticlePageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
  }

  /**
    * Перерисовать главную страницу
    * @param {Object} existingArticle
    * @property {String} text
    * @property {Array<string>} tags
    */
  render(existingArticle) {
    super.render();

    const editor = document.createElement('div');
    const header = document.createElement('h2');
    header.innerHTML = 'Добавление статьи';
    const form = document.createElement('form');
    const tagsBox = document.createElement('div');
    existingArticle.tags.forEach((tag) => {
      const tagDiv = document.createElement('div');
      tagDiv.innerHTML = tag;
      tagDiv.style.color = 'white';
      tagDiv.style.backgroundColor = '#' + genRanHex();
      tagsBox.appendChild(tagDiv);
    });
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleInput.value = existingArticle.title || '';
    const textarea = document.createElement('textarea');
    textarea.value = existingArticle.text || '';
    const button = document.createElement('input');
    button.innerHTML = 'Создать';
    button.type = 'submit';

    form.appendChild(titleInput);
    form.appendChild(textarea);
    form.appendChild(button);

    editor.appendChild(header);
    editor.appendChild(tagsBox);
    editor.appendChild(form);

    this.root.appendChild(createPage(editor));
  }

  /**
   * Отобразить подконтрольную страницу.
   * @param {Object} existingArticle
   * @property {String} text
   * @property {Array<string>} tags
   */
  show(existingArticle) {
    this.root.hidden = false;
    this.render(existingArticle);
  }
}

