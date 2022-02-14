// ///////////////////////////////// //
//
//     Определяет взаимодействие
//     со ссылками, но не с
//     переходами по страницам
//
// ///////////////////////////////// //
const configuration = {};
//   template: {
//     action: () => {

//     },
//     props: null,
//   }

// ///////////////////////////////// //
//
//     Общий глобальный обработчик
//     действует только на ссылки
//
// ///////////////////////////////// //

import {linkControllerDebug} from '../globals';

/**
 * Общий глобальный обработчик. Действует только на ссылки.
 * Здесь можно задать любое поведение при клике на HTMLAnchorElement
 * @param {event} event
 */
function linksControllerClickHandler(event: Event) {
  const target = <HTMLElement>event.target;

  if (target.dataset.router === 'outer') {
    return;
  }

  // ставим preventDefault, чтобы предотварить переход по ссылкам,
  // в которых есть вложенные элементы, ведь их href равен href'у ссылки
  // на всех вложенных элементах такой ссылки должен быть указан
  // data=router='ignore'
  // Нет гарантии, что сработает раньше: linkController или Router
  if (target.dataset.router === 'ignore') {
    event.preventDefault();
    if (linkControllerDebug) {
      console.log('[linkController]', {target}, 'ignored');
    }
  }

  // проверям, что клик был по ссылке (anchor)
  if (target instanceof HTMLAnchorElement) {
    event.preventDefault();

    if (linkControllerDebug) {
      console.log({targeter: target.dataset.section});
    }

    const props: any = configuration[target.dataset.section]?.props;
    const action: Function | undefined = configuration[target.dataset.section]?.action;
    if (typeof action === 'function') {
      action.call(null, props);
    }
  }
}

/**
 * Отвечает за поведение при клике на ссылку,
 * которое не ведет к переходу на другую страницу.
 * HTMLAnchot должен содержать атрибут data-section,
 * который указывается при регистрации
 * @class LinksController
 */
export default class LinksController {
  root: HTMLElement;
  enabled: boolean = false;
  /**
   * @param {HTMLElement} root
   */
  constructor(root: HTMLElement) {
    this.root = root;
  }

  /**
   * Регистрация элемента в контроллере.
   * section - значение data-section соответствующего атрибута.
   * action - действие, выполняемое при клике.
   * props - параметры, передаваемые в action.
   * @param {string} section
   * @param {Function} action
   * @param {any} props
   * @return {LinksController}
   */
  register(section: string, action = () => {}, props: any = null): this {
    configuration[section] = {
      action,
      props,
    };
    return this;
  }

  /**
   * Активирует обработчик кликов на элементе root
   */
  enable() {
    if (!this.enabled) {
      this.enabled = true;
      this.root.addEventListener('click', linksControllerClickHandler);
    }
  }

  /**
   * Дизактивирует обработчик кликов на элементе root
   */
  disable() {
    if (this.enabled) {
      this.enabled = false;
      this.root.removeEventListener('click', linksControllerClickHandler);
    }
  }
}
