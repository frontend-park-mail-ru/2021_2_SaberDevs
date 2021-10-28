import BaseComponentView from '../_basic/baseComponentView.js';
import sidebarComponent from './sidebar.pug.js';

/**
 * @class sidebarView
 */
export default class SidebarView extends BaseComponentView {
  /**
    * @param {string} topBlockContent - вид верхнего блока
    * @return {HTMLElement}
    */
  render(topBlockContent) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = sidebarComponent({topBlockContent});
    return wrapper.firstChild;
  }
}
