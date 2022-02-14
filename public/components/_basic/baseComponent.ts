import BaseComponentView from './baseComponentView';
import {KeyElementsMap} from './baseComponentView';
import {viewsDebug} from '../../globals';

export type InnerComponentsMap = {
  [key: string]: BaseComponent;
} | null;

/**
 * [Интерфейс] ViewModel для View
 * @class BaseComponent
 */
export default class BaseComponent {
  // DOM-HTML-представление компонента
  root: HTMLElement;
  // отображение компонента
  view: BaseComponentView;
  // вложенные компоненты, если есть
  // предполагается, что Мар заполнется в render
  // TODO: перейти на это, сделать интерфейс, проработать VDOM
  innerComponents: InnerComponentsMap = null;
  // подписки на события Flux-store, связанные с компонентом.
  // Удаляются, когда компонент удаляется с помощью выхова destroy().
  unsubscribes: (() => void)[] = [];

  /**
   * Конструктор с логом
   */
  constructor() {
    this.root = document.createElement('div');
    this.unsubscribes = [];

    if (viewsDebug) {
      console.log(`[VIEW ${this.constructor.name}]\tinit`);
    }
  }

  get keyElems() {
    return this.view.keyElems;
  }


  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    if (viewsDebug) {
      console.log(`[VIEW ${this.constructor.name}]\trender`);
    }
    return document.createElement('div');
  }

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    if (viewsDebug) {
      console.log(`[VIEW  ${this.constructor.name}]\tdestroy`);
    }
    this.view = null;
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
  }
}
