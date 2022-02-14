import BaseComponentView from '../_basic/baseComponentView';
import sidebarComponent from './sidebar.pug.js';
import streamCommentComponent from './streamComment.pug.js';

import {Comment} from '../../common/types';

/**
 * @class sidebarView
 */
export default class SidebarView extends BaseComponentView {
  root: HTMLElement;

  /**
   * Полоса интерфейса справа от основного контента страницы
   */
  constructor() {
    super();
    this.root = document.createElement('div');
  }

  /**
    * @param {Array<string>} categoriesList
    * @param {number} limit
    * @param {Array<Comment>} comments
    * @return {HTMLElement}
    */
  render(categoriesList: string[], limit: number, comments: Comment[]) {
    let streams: string = '';
    comments.forEach((element) => streams += <string> streamCommentComponent(element));

    const wrapper = document.createElement('div');
    wrapper.innerHTML = <string> sidebarComponent({
      categoriesList,
      limit,
      streams,
    });

    this.root = <HTMLElement> wrapper.firstElementChild;
    return this.root;
  }

  /**
   * Заполнить верхний блок сайдбара произвольным HTML
   * @param {string} topBlockContent - вид верхнего блока
   */
  setTopBlockContent(topBlockContent: string) {
    this.root.querySelector('#sidebarTopBlockContent').innerHTML = topBlockContent;
  }

  /**
   * @param {Array<Comment>} comments
   */
  addComments(comments: Comment[]) {
    const streamComments = <HTMLElement> <HTMLElement> this.root.querySelector('.sidebar__streams');
    comments.forEach((element) => {
      const streamComment = <string> streamCommentComponent(element);
      streamComments.insertAdjacentHTML('afterbegin', streamComment);
    });
  }
}
