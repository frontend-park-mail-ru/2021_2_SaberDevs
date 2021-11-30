import BasePageView from './basePageView.js';
import {pageDebug} from '../globals.js';
/**
 * ModalView-контроллер для соответсвующих страниц
 * @class BasePageMV
 */
export default class BasePageMV {
  /**
   * Страница содержит главный компонент - .
   * @param {HTMLElement} root
   */
  constructor(root) {
    if (pageDebug) {
      console.log(`[PAGE ${this.constructor.name}]\tinit`);
    }
    this.view = new BasePageView(root);
  }

  /**
   * true - эдемент активен, его нежелательно перетирать
   * @return {boolean}
   */
  isActive() {
    if (pageDebug) {
      console.log(`[PAGE ${this.constructor.name}]\tisActive`);
    }
    return this.view.isActive();
  }

  /**
   * Скрыть подконтрольную страницу
   */
  hide() {
    if (pageDebug) {
      console.log(`[PAGE ${this.constructor.name}]\thide`);
    }
    this.view.hide();
  }

  /**
   * Отобразить подконтрольную страницу.
   * Должен быть вызван render() для обновления.
   */
  show() {
    if (pageDebug) {
      console.log(`[PAGE ${this.constructor.name}]\tshow`);
    }
    this.view.show();
  }

  /**
   * Вызывается в роутере. Если return не '', нужно выполнить переход
   * по пути, возвращенному из функции
   * @param {string} currentPath
   * @return {string}
   */
  redirect(currentPath) {
    return '';
  }
}
