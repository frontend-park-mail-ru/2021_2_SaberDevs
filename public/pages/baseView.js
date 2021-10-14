/**
 * @class BaseView
 * @module BaseView
 */
export default class BaseView {
  /**
   * @param {HTMLElement} rootElement
   */
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.rootElement.dataset.view = this.constructor.name;
    this.rootElement.hidden = true;
  }

  /**
   * true - эдемент активен, его нежелательно перетирать
   * @return {boolean}
   */
  isActive() {
    return !this.rootElement.hidden;
  }

  /**
   * Скрыть элемент
   */
  hide() {
    this.rootElement.hidden = true;
  }

  /**
   * Показать элемент. Вызывает render() для обновления.
   */
  show() {
    this.rootElement.hidden = false;
    this.render();
  }

  /**
   * Перерисовать элемент.
   */
  render() {

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
