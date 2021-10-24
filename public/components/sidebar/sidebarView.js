import BaseComponentView from '../_basic/baseComponentView.js';
import sidebarComponent from './sidebar.pug.js';

/**
 * @class sidebarView
 */
export default class SidebarView extends BaseComponentView {
  /**
    * @param {string} content - вид правого блока
    * @return {HTMLElement}
    */
  render(content) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = sidebarComponent({content});
    return wrapper.firstChild;
  }
}
