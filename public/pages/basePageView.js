import {pageDebug} from '../globals.js';

/**
 * View для соответсвующих страниц
 * @class BasePageView
 */
export default class BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    this.root = root;
    this.root.dataset.view = this.constructor.name;
    this.root.hidden = true;
    this.root.style.display = 'none';
  }

  /**
   * true - эдемент активен, его нежелательно перетирать
   * @return {boolean}
   */
  isActive() {
    return !this.root.hidden;
  }

  /**
   * Скрыть подконтрольную страницу
   */
  hide() {
    this.root.hidden = true;
    this.root.style.display = 'none';
  }

  /**
   * Отобразить подконтрольную страницу.
   * Должен быть вызван render() для обновления.
   */
  show() {
    this.root.style.display = 'flex';
    this.root.hidden = false;
    this.render();
  }

  /**
   * Стереть подконтрольную страницу
   */
  render() {
    if (pageDebug) {
      console.log(`[PAGE ${this.constructor.name}]\trender`);
    }
    this.root.innerHTML = '';
    // this.root.appendChild(createPage(заголовок, контент));
  }
}
