import BasePageView from './basePageView.js';
import Header from '../components/header.js';
import Sidebar from '../components/sidebar.js';
// import cardComponent from '../components/card.pug.js';
// import newsBarComponent from '../components/newsbar.js';
// import userPreviewComponent from '../components/userPreview.pug.js'
// import modalComponent from '../components/modal.js';

// ///////////////////////////////// //
//
//              Main Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
 * @class MainPage
 * @module MainPage
 */
export default class MainPageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.pageComponents = {
      header: new Header(),
      sidebar: new Sidebar(),
    };
  }

  /**
    * @param {Object} pageComponents
    */
  render() {
    super.render();
    if (viewsDebug) {
      console.log('MainPageView render');
    }
    const root = this.root;

    root.innerHTML = '';
    root.appendChild(this.pageComponents.header.render());

    const mainContainer = document.createElement('main');
    mainContainer.className = 'container';
    mainContainer.appendChild(this.pageComponents.sidebar.render());

    // const contentDiv = document.createElement('div');
    // contentDiv.className = 'content col';
    // contentDiv.id = 'menu-content-block';

    // if (JSON.stringify(state.cards) === '[]') {
    //   uploadNextCards();
    // }
    // state.cards.forEach((element) => {
    //   contentDiv.innerHTML += cardComponent(element);
    // });

    // contentDiv.innerHTML += cardComponent(loadingCard);

    // mainContainer.appendChild(contentDiv);
    root.appendChild(mainContainer);
  }
}
