import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import ProfileCard from '../components/profileCard/profileCard.js';
import createToMenuBtn from '../components/buttonToMenu.js';

/**
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
 * @class ProfilePageView
 */
export default class ProfilePageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.pageComponents = {
      profileCard: new ProfileCard(),
    };
  }

  /**
   * Страница содержит главный компонент - карточку пользователя и его статьи
   */
  render() {
    super.render();
    this.root.appendChild(createPage(
        createToMenuBtn(),
        this.pageComponents.ProfileCard,
    ));
  }
}
