import BaseComponentView from './baseComponentView.js';
import ... from './.pug.js';

/**
 * @class Template
 */
export default class TemplateView extends BaseComponentView {
  /**
    * @param {string} content - вид правого блока
    * @return {HTMLElement}
    */
  render(content) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = '';
    return wrapper.firstChild;
  }
}
