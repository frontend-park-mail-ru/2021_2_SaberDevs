import BaseComponentView from './baseComponentView.js';
import {viewsDebug} from '../../globals.js';

/**
 * [Интерфейс] ViewModel для View
 * @class BaseComponent
 */
export default class BaseComponent {
  /**
   * Конструктор с логом
   */
  constructor() {
    this.root = document.createElement('div');
    this.view = new BaseComponentView();
    this.unsubscribes = [];

    if (viewsDebug) {
      console.log(`[VIEW ${this.constructor.name}]\tinit`);
    }
  }


  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    if (viewsDebug) {
      console.log(`[VIEW ${this.constructor.name}]\trender`);
    }
    return document.createElement('div');
  }

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    if (viewsDebug) {
      console.log(`[VIEW  ${this.constructor.name}]\tdestroy`);
    }
    this.view = null;
    this.unsubscribes.forEach((unsubscribe) => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
  }
}
