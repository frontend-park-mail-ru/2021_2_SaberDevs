import BaseComponentView from '../_basic/baseComponentView';
import articleReaderComponent from './articleReader.pug.js';

import {genRanHexColor} from '../../common/utils.js';

import {Article} from '../../common/types';
import {KeyElementsMap, IKeyElementsMap} from '../_basic/baseComponentView';

interface IKeyElementsMapReader extends IKeyElementsMap {
  changeBtn: HTMLAnchorElement; // TODO: change to <Button>
  authorSign: HTMLAnchorElement;
  commentsBox: HTMLDivElement;
  showCommentsBtn: HTMLDivElement; // TODO: change to <Button>
  commentInput: HTMLInputElement;
}

export type KeyElementsMapReader = KeyElementsMap<IKeyElementsMapReader>;


/**
 * @class ReaderView
 */
export default class ReaderView extends BaseComponentView {
  keyElems: KeyElementsMapReader;

  /**
   * Компонент редактора
   */
  constructor() {
    super();
  }

  /**
   * Задать содержание статьи
   * @param {Article} article
   * @return {HTMLElement}
   */
  render(article: Article): HTMLElement {
    const tags = article.tags.map((el) => ({
      content: el,
      color: genRanHexColor(el),
    }));

    const wrapper = document.createElement('div');

    wrapper.innerHTML = <string> articleReaderComponent({
      ...article,
      category: article?.category ? {
        content: article.category,
        color: genRanHexColor(article.category),
      } : {
        content: '',
        color: '',
        message: 'Комментарий',
      },
      tags,
    });

    const reader = <HTMLDivElement> wrapper.firstElementChild;
    const changeBtn = <HTMLAnchorElement> reader.querySelector('a#article-change-btn');
    const authorSign = <HTMLAnchorElement> reader.querySelector('div.article-view__author > a');
    const commentsBox = <HTMLDivElement> reader.querySelector('div[data-inplace="comments"]');
    const showCommentsBtn = <HTMLDivElement> reader.querySelector('.comments-show');
    const commentInput = <HTMLInputElement> reader.querySelector('input.article-view__comment-input');

    if (!(changeBtn && authorSign && commentsBox && showCommentsBtn && commentInput)) {
      console.warn(
        '{Reader} component template contains an error',
      );
      return document.createElement('div');
    }

    this.keyElems = {
      changeBtn,
      authorSign,
      commentsBox,
      showCommentsBtn,
      commentInput,
    };

    return reader;
  }
}
