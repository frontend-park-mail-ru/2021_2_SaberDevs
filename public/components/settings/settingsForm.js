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
    // TODO: обработчик кнопки сменить пароль

    this.root = this.view.render();
    return this.root;
  }

  /**
   * Показать предупреждение в окне ошибок
   * @param {string | HTMLString} msg
   */
  appendWarning(msg) {
    const formWarning = this.root.querySelector('.settings__warning');
    if (!formWarning) {
      console.warn(`[SignupFormView]
        appendWarning call while SignupForm was not rendered`);
    }
    formWarning.style.display = 'block';
    formWarning.style.margin = '3rem 0';
    formWarning.innerHTML = msg;
  }
}
