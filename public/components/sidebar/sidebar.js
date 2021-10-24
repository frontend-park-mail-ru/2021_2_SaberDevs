import BaseComponent from '../_basic/baseComponent.js';
import SidebarView from './sidebarView.js';

import store from '../../flux/store.js';
import {} from '../../flux/actions.js';
import {} from '../../flux/types.js';

/**
 * ViewModel-компонент соответсвующего View
 * @class Sidebar
 */
export default class Sidebar extends BaseComponent {
  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new SidebarView();

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    // TODO: sidebar actions
    // this.unsubscribes.push(store.subscribe(..., () => {
    //   store.dispatch(
    //   );
    // }));
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();

    const state = store.getState().mainPage;
    this.root = this.view.render(state.sideBarLinks);
    return this.root;
  }

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    super.destroy();
  }
}
