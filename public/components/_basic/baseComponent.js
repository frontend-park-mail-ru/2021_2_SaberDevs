import BaseComponentView from './baseComponentView.js';
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
   */
  render() {
    if (viewsDebug) {
      console.log(`[VIEW ${this.constructor.name}]\trender`);
    }
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
