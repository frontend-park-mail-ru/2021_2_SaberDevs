import BaseComponentView from '../../_basic/baseComponentView.js';
import mainPagePreviewBarComponent from './mainPagePreviewBar.pug.js';

// захочешь вернуть, глянь шаблон. Там другие поля
const loadingCard = {
  id: 'loading-card',
  previewUrl: 'static/img/loader-1-HorizontalBalls.gif',
  tags: [],
  title: 'Загрузка...',
  text: `Еще чуть-чуть...`,
  authorUrl: '',
  authorName: 'loading',
  authorAvatar: '',
  commentsUrl: '',
};

/**
 * @class serviceWarningView
 */
export default class MainPagePreviewBarView extends BaseComponentView {
  /**
    * @return {HTMLElement}
    */
  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = mainPagePreviewBarComponent(loadingCard);
    return wrapper.firstChild;
  }
}
