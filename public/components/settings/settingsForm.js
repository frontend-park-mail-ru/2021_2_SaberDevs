import BaseComponent from '../_basic/baseComponent.js';
import SettingsFormView from './settingsFormView.js';

/**
 * @class SettingsForm
 */
export default class SettingsForm extends BaseComponent {
  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new SettingsFormView();
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();

    this.root = this.view.render();
    return this.root;
  }
}
