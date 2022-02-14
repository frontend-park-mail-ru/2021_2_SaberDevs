import BaseComponent from '../_basic/baseComponent';
import SettingsFormView from './settingsFormView';

import {KeyElementsMapSettingsForm} from './SettingsFormView';

/**
 * @class SettingsForm
 */
export default class SettingsForm extends BaseComponent {
  view: SettingsFormView;

  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new SettingsFormView();
  }

  get keyElems(): KeyElementsMapSettingsForm {
    return this.view.keyElems;
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();
    // TODO: обработчик кнопки сменить пароль

    this.root = this.view.render();
    if (!this.keyElems) {
      return document.createElement('div');
    }
    
    return this.root;
  }

  /**
   * Показать предупреждение в окне ошибок
   * @param {string} msg
   */
  appendWarning(msg: string) {
    if (!this.keyElems) {
      console.warn(`[SignupFormView]
        can't perform an appendWarning call while SignupForm was not rendered`);
    }
    this.keyElems.formWarning.style.display = 'block';
    this.keyElems.formWarning.style.margin = '3rem 0';
    this.keyElems.formWarning.innerHTML = msg;
  }
}
