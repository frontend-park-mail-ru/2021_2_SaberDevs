import BasePageView from './basePageView';
import createPage from './_createPage.js';

import Editor from '../components/editor/editor';

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
    this.root.appendChild(createPage(
        '',
        this.pageComponents.editor,
    ));
  }
}

