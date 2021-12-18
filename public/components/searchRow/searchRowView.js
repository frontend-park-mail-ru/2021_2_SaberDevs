import BaseComponentView from '../_basic/baseComponentView.js';
import searchRowComponent from './searchRow.pug.js';
/**
 * @class searchRowView
 */
export default class searchRowView extends BaseComponentView {
  /**
   * @param {boolean} isDisplayRelative
   * @param {boolean} isDefaultOpen
    * @return {HTMLElement}
    */
  render(isDisplayRelative, isDefaultOpen) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = searchRowComponent({
      relative: isDisplayRelative,
      open: isDefaultOpen,
    });
    return wrapper.firstChild;
  }
}
