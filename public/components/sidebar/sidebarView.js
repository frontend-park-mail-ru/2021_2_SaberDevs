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
    * @return {HTMLElement}
    */
  render(topBlockContent) {
    // пример подключения стрим-комментария
    let streams = '';
    const streamComment = streamCommentComponent({
      avatarUrl: '../../static/img/users/user.jpg',
      firstName: 'Sveta',
      text: 'Текст стрим-комментария',
    });
    streams += streamComment;
    streams += streamComment;
    streams += streamComment;
    streams += streamComment;
    streams += streamComment;
    streams += streamComment;
    streams += streamComment;
    streams += streamComment;
    streams += streamComment;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = sidebarComponent({
      topBlockContent,
      streams: streams,
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
}
