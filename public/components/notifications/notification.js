import BaseComponent from '../_basic/baseComponent.js';
import NotificationView from './notificationView.js';

/**
 * @class ServiceWarning
 */
export default class Notification extends BaseComponent {
  /**
   * Окошко сообщений о состоянии сервиса
   * @param {string} title
   * @param {string | HTMLString} content
   * @param {string} bkColor
   * @param {number?} duration
   */
  constructor(title, content, bkColor, duration) {
    super();
    this.view = new NotificationView();
    this.params = {
      id: 'Notification' + Math.floor(Math.random() * 16),
      title,
      content,
      bkColor,
      duration,
    };
  }


  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    return this.view.render(this.params);
  }
}
