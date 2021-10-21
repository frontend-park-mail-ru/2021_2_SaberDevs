import BasePageMV from './basePageMV.js';
import MainPageView from './mainPageView.js';

// import sideBarComponent from '../components/sidebar.pug.js';
// import cardComponent from '../components/card.pug.js';
// import newsBarComponent from '../components/newsbar.js';
// import userPreviewComponent from '../components/userPreview.pug.js'
// import modalComponent from '../components/modal.js';

// ///////////////////////////////// //
//
//              Main Page
//
// ///////////////////////////////// //

// const endOfFeedMarkerID = 'end';
// const resetDoNotUploadTime = 60000;  // anti- brutforce

/**
 * @class MainPage
 * @module MainPage
 */
export default class MainPage extends BasePageMV {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);
    this.view = new MainPageView(root);
  }

  /**
   * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
   */
  render() {
    this.view.render();
  }
}
