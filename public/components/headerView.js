import BaseComponentView from './baseComponentView.js';
import headerComponent from './header.pug.js';

/**
 * @class Header
 */
export default class HeaderView extends BaseComponentView {
  /**
    * @param {string} content - вид правого блока
    * @return {HTMLElement}
    */
  render(content) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = headerComponent({content});
    return wrapper.firstChild;
  }
}
