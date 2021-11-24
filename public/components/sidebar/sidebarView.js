import BaseComponentView from '../_basic/baseComponentView.js';
import sidebarComponent from './sidebar.pug.js';
import streamCommentComponent from './streamComment.pug.js';
// import webSocket from '../../modules/webSocket.js';

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
    * @return {HTMLElement}
    */
  render(topBlockContent, categoriesList, limit) {
    // пример подключения стрим-комментария
    let streams = '';
    const streamComment = streamCommentComponent({
      avatarUrl: '../../static/img/users/user.jpg',
      firstName: 'Это константный комментрий для теста',
      text: 'Лбим хардкод, да',
    });
    streams += streamComment;

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
}
