import BasePageView from './basePageView.js';
import createPage from './_createPage.js';
import articleComponent from '../components/article/article.pug.js';
import formSettingsTextareaComponent from
  '../components/settings/formSettingsTextarea.pug.js';
import formSettingsRowComponent from
  '../components/settings/formSettingsRow.pug.js';

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
    let articleRows = '';
    const title = formSettingsRowComponent({
      label: 'Заголовок',
      type: 'text',
      name: 'title',
      placeholder: 'Введите заголовок статьи',
      pattern: '',
      value: existingArticle.title || '',
    });
    articleRows += title;
    const text = formSettingsTextareaComponent({
      label: 'Текст статьи',
      name: 'text',
      placeholder: '',
      value: existingArticle.text || '',
    });
    articleRows += text;

    const tagsBox = document.createElement('div');
    existingArticle.tags.forEach((tag) => {
      const tagDiv = document.createElement('div');
      tagDiv.className = 'tags__tag';
      tagDiv.innerHTML = tag;
      tagDiv.style.color = 'white';
      tagDiv.style.backgroundColor = '#' + genRanHex();
      tagsBox.appendChild(tagDiv);
    });

    const editor = document.createElement('div');
    editor.innerHTML = articleComponent({
      form_rows: articleRows,
      tags: tagsBox.innerHTML,
    });

    const addTag = editor.getElementsByClassName('article__add-tag')[0];
    console.log('add tag: ', addTag);
    addTag.addEventListener('click', (e) => {
      console.log('clickkkk');
      e.preventDefault();
      const tags = document.getElementsByClassName('article__tags')[0];
      const inputTag = document.getElementsByClassName('article__input-tag')[0];
      const tagDiv = document.createElement('div');
      tagDiv.className = 'tags__tag';
      tagDiv.innerHTML = inputTag.value;
      tagDiv.style.color = 'white';
      tagDiv.style.backgroundColor = '#' + genRanHex();
      tags.appendChild(tagDiv);
    });

    this.root.appendChild(createPage(editor.firstChild));
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

