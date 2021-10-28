import BaseComponentView from '../_basic/baseComponentView.js';
import headerComponent from './header.pug.js';

/**
 * @class Header
 */
export default class HeaderView extends BaseComponentView {
  /**
    * @return {HTMLElement}
    */
  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = headerComponent();
    return wrapper.firstChild;
  }
}
