import Notification from './notification.js';

// const maxLimit = 8;
const notifRoot = document.getElementById('warningroot');

/**
 * @class Notifications
 */
class Notifications {
  /**
   * окошко сообщений о состоянии сервиса
   */
  constructor() {
    this.counter = 0;
    this.notifications = [];
  }
  /**
   * Добавить новое сообщение в окошко сообщений о состоянии сервиса
   * @param {string} title
   * @param {string | HTMLString} content
   * @param {string} bkColor
   * @param {number?} duration
   */
  append(title, content, bkColor, duration) {
    const notif = new Notification(title, content, bkColor, duration);
    this.notifications.push(notif);
    notifRoot.appendChild(notif.render());
  }
}

/**
 * Окошко сообщений о состоянии сервиса
 */
const notifications = new Notifications();

export default notifications;
