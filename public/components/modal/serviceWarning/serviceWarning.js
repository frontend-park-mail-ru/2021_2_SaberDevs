import BaseComponent from '../../_basic/baseComponent.js';
import ServiceWarningView from './serviceWarningView.js';

/**
 * @class ServiceWarning
 */
export default class ServiceWarning extends BaseComponent {
  /**
   * Окошко сообщений о состоянии сервиса
   */
  constructor() {
    super();
    this.view = new ServiceWarningView();
  }


  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();
    console.warn(this.root);

    return this.root;
  }

  /**
   * @param {string} msg
   */
  setMessage(msg) {
    this.root.innerHTML = msg;
  }

  /**
   * Возврат отображаемого сообщения
   * @return {string}
   */
  getMessage() {
    return this.root.innerHTML;
  }

  /**
   * @param {string} msg
   */
  show(msg) {
    this.root.style.display = 'block';
    if (msg) {
      this.root.innerHTML = msg;
    }
    console.warn(this.root);
  }

  /**
   * спрятать
   */
  hide() {
    this.root.style.display = 'none';
  }
}
