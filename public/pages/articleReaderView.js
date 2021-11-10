import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Reader from '../components/reader/reader.js';

// ///////////////////////////////// //
//
//              Article Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - HTML-контент статьи.
 * @class ReaderView
 */
export default class ReaderView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.pageComponents = {
      reader: new Reader(),
    };
  }

  /**
   * Отрисовка страницы
   */
  render() {
    super.render();
    this.root.appendChild(createPage(
        this.pageComponents.reader,
        // TODO: comments component
    ));
  }
}

