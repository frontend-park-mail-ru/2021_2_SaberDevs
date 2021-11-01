import BaseComponentView from '../_basic/baseComponentView.js';
import profileCardComponent from './profileCard.pug.js';
import cardComponent from '../feed/card.pug.js';

/**
 * @class profileCard
 */
export default class profileCardView extends BaseComponentView {
  /**
  * Хранит состояние - загруженные статьи автора
  * @param {string} preview
  * @param {Array.Card} articles массив карточек (может быть пустым)
  */
  constructor() {
    super();
    // this.root = this.render(preview, articles);
    this.root = document.createElement('div');
    this.root.innerHTML = 'компонент profileCard';
  }

  /**
    * @param {Object} user
    * @param {Array.Card} articles массив карточек (может быть пустым)
    * @return {HTMLElement}
    */
  render(user, articles) {
    let content = '';
    articles.forEach((element) => {
      content += cardComponent(element);
    });
    const wrapper = document.createElement('div');
    wrapper.innerHTML = profileCardComponent({
      ...user,
      articles: content,
    });
    this.root = wrapper.firstChild;
    return wrapper.firstChild;
  }

  /**
   * @param {Array.Card} articles
   */
  addArticles(articles) {
    const articlesDiv = this.root.querySelector(`.feed__cards`);
    if (!articlesDiv) {
      console.warn('cannot append articles till profileCard is not rendered');
      return;
    }
    articles.forEach((element) => {
      articlesDiv.insertAdjacentHTML(
          'beforeend',
          cardComponent(element),
      );
    });
  }

  /**
   * hide loading component
   */
  hideLoadingAnimation() {
    this.root.querySelector('#feed-loading').style.visibility = 'hidden';
  }
}
