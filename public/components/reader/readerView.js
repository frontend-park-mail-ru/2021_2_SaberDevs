import BaseComponentView from '../_basic/baseComponentView.js';
import articleReaderComponent from './articleReader.pug.js';

import {genRanHexColor} from '../../common/utils.js';

/**
 * @class ReaderView
 */
export default class ReaderView extends BaseComponentView {
  /**
   * Компонент редактора
   */
  constructor() {
    super();
  }

  /**
   * Задать содержание статьи
   * @param {Object} article
   * @property {string} title
   * @property {string} text
   * @property {Array<string>} tags
   * @property {string} datetime
   * @property {Object} author
   * @property {number} likes
   * @property {number} comments
   * @return {HTMLElement}
   */
  render(article) {
    const reader = document.createElement('div');
    reader.innerHTML = articleReaderComponent({
      ...article,
      category: article?.category ? {
        content: article.category,
        color: genRanHexColor(article.category),
      } : {
        content: '',
        color: '',
      },
    });

    return reader.firstChild;
  }
}
