import BaseComponent from '../_basic/baseComponent.js';
import MainPagePreviewBarView from './mainPagePreviewBarView.js';

// TODO: MainPagePreviewBar -динамическая подборка популярых записей

/**
 * @class MainPagePreviewBar
 */
export default class MainPagePreviewBar extends BaseComponent {
  /**
   * Топ популярных новостей
   */
  constructor() {
    super();
    this.view = new MainPagePreviewBarView();
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render();
    return this.root;
  }
}
