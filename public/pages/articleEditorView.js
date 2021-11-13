import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Editor from '../components/editor/editor.js';
// import {genRanHex} from '../common/utils.js';

// ///////////////////////////////// //
//
//              Article Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - редактор статьи.
 * @class EditorView
 */
export default class EditorView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.pageComponents = {
      editor: new Editor(),
    };
  }

  /**
   * Отрисовка страницы
   */
  render() {
    super.render();
    // TODO: tag selector component
    // const tagsBox = document.createElement('div');
    // existingArticle.tags.forEach((tag) => {
    //   const tagDiv = document.createElement('div');
    //   tagDiv.className = 'tags__tag';
    //   tagDiv.innerHTML = tag;
    //   tagDiv.style.color = 'white';
    //   tagDiv.style.backgroundColor = '#' + genRanHex();
    //   tagsBox.appendChild(tagDiv);
    // });
    // const addTag = editor.getElementsByClassName('article__add-tag')[0];
    // console.log('add tag: ', addTag);
    // addTag.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   const tags = document.getElementsByClassName('article__tags')[0];
    //   const inputTag =
    // document.getElementsByClassName('article__input-tag')[0];
    //   const tagDiv = document.createElement('div');
    //   tagDiv.className = 'tags__tag';
    //   tagDiv.innerHTML = inputTag.value;
    //   tagDiv.style.color = 'white';
    //   tagDiv.style.backgroundColor = '#' + genRanHex();
    //   tags.appendChild(tagDiv);
    // });
    this.root.appendChild(createPage(
        this.pageComponents.editor,
    ));
  }
}

