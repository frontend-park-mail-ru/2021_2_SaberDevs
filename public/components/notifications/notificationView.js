import BaseComponentView from '../_basic/baseComponentView.js';
import notificationComponent from './notification.pug.js';

/**
 * @class serviceWarningView
 */
export default class NotificationView extends BaseComponentView {
  /**
   * @param {string} id
   * @param {string} title
   * @param {string | HTMLString} content
   * @param {string} bkColor
   * @param {number?} duration
   * @return {HTMLElement}
  */
  render(id, title, content, bkColor, duration) {
    const notifWrapper = document.createElement('div');
    notifWrapper.innerHTML = notificationComponent({
      id,
      title,
      content,
      bkColor,
      duration,
    });
    return notifWrapper.firstChild;
  }
}
