import BaseComponentView from '../_basic/baseComponentView';
import settingsComponent from './settings.pug.js';
import formSettingsTextareaComponent from './formSettingsTextarea.pug.js';
import formSettingsRowComponent from './formSettingsRow.pug.js';

import {KeyElementsMap, IKeyElementsMap} from '../_basic/baseComponentView';

interface IKeyElementsMapSettingsForm extends IKeyElementsMap {
  formWarning: HTMLDivElement;
}

export type KeyElementsMapSettingsForm = KeyElementsMap<IKeyElementsMapSettingsForm>;

/**
 * @class SettingsFormView
 */
export default class SettingsFormView extends BaseComponentView {
  keyElems: KeyElementsMapSettingsForm;

  /**
    * @return {HTMLElement}
    */
  render(): HTMLElement {
    let settingsRows = '';
    const username = <string> formSettingsRowComponent({
      label: 'Имя',
      type: 'text',
      name: 'username',
    });
    settingsRows += username;
    const surname = <string> formSettingsRowComponent({
      label: 'Фамилия',
      type: 'text',
      name: 'surname',
    });
    settingsRows += surname;
    const description = <string> formSettingsTextareaComponent({
      label: 'О себе',
      name: 'description',
    });
    settingsRows += description;
    const photo = <string> formSettingsRowComponent({
      label: 'Фото',
      type: 'file',
      name: 'photo',
      placeholder: 'Загрузите фото',
    });
    settingsRows += photo;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = <string> settingsComponent({
      other_page_name: 'сменить пароль',
      other_page_href: '',
      form_rows: settingsRows,
    });

    const settingsBar = <HTMLElement> wrapper.firstElementChild;

    const formWarning = <HTMLDivElement> settingsBar.querySelector('.settings__warning');

    if (!(formWarning)) {
      console.warn(
        '{SettingsForm} component template contains an error',
      );
      return document.createElement('div');
    }
    
    this.keyElems = {
      formWarning,
    };

    return settingsBar;
  }
}