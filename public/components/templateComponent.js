import BaseComponent from './baseComponent.js';
import ...View from './View.js';

import store from '../flux/store.js';
import {} from '../flux/actions.js';
import {} from '../flux/types.js';

/**
 * ViewModel-компонент соответсвующего View
 * @class Template
 */
export default class Template extends BaseComponent {
  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new ...View();

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    this.unsubscribes.push(store.subscribe(..., () => {
      store.dispatch(

      );
    }));
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

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    super.destroy();
  }
}
