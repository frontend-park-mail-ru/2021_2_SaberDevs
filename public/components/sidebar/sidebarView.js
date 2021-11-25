import BaseComponentView from '../_basic/baseComponentView.js';
import sidebarComponent from './sidebar.pug.js';
import streamCommentComponent from './streamComment.pug.js';

/**
 * @class sidebarView
 */
export default class SidebarView extends BaseComponentView {
  /**
   * Полоса интерфейса справа от основного контента страницы
   */
  constructor() {
    super();
    this.root = document.createElement('div');
  }

  /**
    * @param {string} topBlockContent - вид верхнего блока
    * @param {string} categoriesList
    * @param {string} limit
    * @param {Array<Comment>} comments
    * @return {HTMLElement}
    */
  render(topBlockContent, categoriesList, limit, comments) {
    let streams = '';
    comments.forEach((element) => {
      const streamComment = streamCommentComponent(element);
      streams += streamComment;
    });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = sidebarComponent({
      topBlockContent,
      categoriesList,
      limit,
      streams,
    });

    this.root = wrapper.firstChild;
    return this.root;
  }

  /**
   * Заполнить верхний блок сайдбара произвольным HTML
   * @param {string} topBlockContent - вид верхнего блока
   */
  setTopBlockContent(topBlockContent) {
    const contentDiv = this.root.querySelector('#sidebarTopBlockContent');
    if (contentDiv) {
      contentDiv.innerHTML = topBlockContent;
    } else {
      this.render(topBlockContent);
    }
  }

  /**
   * @param {Array<Comment>} comments
   */
  addComments(comments) {
    const streamComments = this.root.querySelector('.sidebar__streams');
    comments.forEach((element) => {
      const streamComment = streamCommentComponent(element);
      streamComments.insertAdjacentHTML('afterbegin', streamComment);
    });
  }
}
