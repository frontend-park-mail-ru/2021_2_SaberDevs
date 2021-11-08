import BaseComponentView from '../_basic/baseComponentView.js';
import settingsComponent from './settings.pug.js';
import formSettingsTextareaComponent from './formSettingsTextarea.pug.js';
import formSettingsRowComponent from './formSettingsRow.pug.js';

import regexp from '../../common/regexpString.js';

/**
 * @class SettingsFormView
 */
export default class SettingsFormView extends BaseComponentView {
  /**
    * @return {HTMLElement}
    */
  render() {
    let settingsRows = '';
    const username = formSettingsRowComponent({
      label: 'Имя',
      type: 'text',
      name: 'username',
      pattern: regexp.firstName,
    });
    settingsRows += username;
    const surname = formSettingsRowComponent({
      label: 'Фамилия',
      type: 'text',
      name: 'surname',
      pattern: regexp.lastName,
    });
    settingsRows += surname;
    const description = formSettingsTextareaComponent({
      label: 'О себе',
      name: 'description',
    });
    settingsRows += description;
    const photo = formSettingsRowComponent({
      label: 'Фото',
      type: 'file',
      name: 'photo',
      placeholder: 'Загрузите фото',
    });
    settingsRows += photo;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = settingsComponent({
      other_page_name: 'сменить пароль',
      other_page_href: '',
      form_rows: settingsRows,
    });
    return wrapper.firstChild;
  }
}
