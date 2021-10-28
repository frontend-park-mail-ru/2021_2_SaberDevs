import BasePageView from './basePageView.js';

import profileComponent from '../components/profile/profile.pug.js';
import createToMenuBtn from '../components/buttonToMenu.js';

/**
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
 * @class ProfilePage
 * @module ProfilePage
 */
export default class ProfilePageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.pageComponents = {};
  }

  /**
   * @param {Object} pageState данные, необходимые для корректного отображения
   * Страница содержит главный компонент - карточку пользователя
   */
  render(pageState) {
    super.render();

    const root = this.root;
    root.innerHTML = '';

    const profile = document.createElement('div');
    profile.innerHTML = profileComponent(pageState);

    const backBtn = createToMenuBtn();

    root.appendChild(profile);
    root.appendChild(backBtn);
  }

  /**
   * Отобразить подконтрольную страницу.
   * Должен быть вызван render() для обновления.
   * @param {Object} pageState данные, необходимые для корректного отображения
   */
  show(pageState) {
    this.root.hidden = false;
    this.render(pageState);
  }
}
