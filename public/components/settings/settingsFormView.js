import BaseComponentView from '../_basic/baseComponentView.js';
import settingsComponent from './settings.pug.js';
import formSettingsTextareaComponent from './formSettingsTextarea.pug.js';
import formSettingsRowComponent from './formSettingsRow.pug.js';

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
      placeholder: 'Введите имя',
      pattern: '',
    });
    settingsRows += username;
    const surname = formSettingsRowComponent({
      label: 'Фамилия',
      type: 'text',
      name: 'surname',
      placeholder: 'Введите фамилию',
      pattern: '',
    });
    settingsRows += surname;
    const description = formSettingsTextareaComponent({
      label: 'О себе',
      name: 'description',
      placeholder: 'О себе',
    });
    settingsRows += description;
    const photo = formSettingsRowComponent({
      label: 'Фото',
      type: 'file',
      name: 'photo',
      placeholder: 'Загрузите фото',
      pattern: '',
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
