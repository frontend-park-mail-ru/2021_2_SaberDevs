import store from '../flux/store.js';
import {routerTypes} from '../flux/types.js';

/**
 * @class Router
 * @module Router
 */
export default class Router {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    this.routes = {};
    this.routesPatterned = [];
    this.root = root;
  }

  /**
   * @param {string} path
   * @param {BasePageMV} PageClass
   * @return {Router}
   */
  register(path, PageClass) {
    this.routes[path] = {
      PageClass,
      page: null,
      root: null,
    };

    return this;
  }

  /**
   * Для url параметров .../path/<param>
   * @param {string} path
   * текст url внутри знаков <> вида <param> не будет проверяться
   * на точное равенство
   * @param {BasePageMV} PageClass
   * @return {Router}
   */
  registerPattern(path, PageClass) {
    path = path.slice(0, path.indexOf('<'));
    this.routesPatterned.push(path);
    this.routes[path] = {
      PageClass,
      page: null,
      root: null,
    };

    return this;
  }

  /**
   * @param {string} link
   */
  open(link) {
    let path = link;
    // Проверяем, является ли путь шаблонным
    this.routesPatterned.forEach((pattern) => {
      if (path.startsWith(pattern)) {
        console.log(`[ROUTER] ${path} matched pattern ${pattern}`);
        path = pattern;
      }
    });

    const route = this.routes[path];

    if (!route) {
      console.warn('[ROUTER] путь', path, 'не зарегистрирован');
      this.open('/');
      return;
    }

    let {PageClass, page, root} = route;

    if (!root) {
      root = document.createElement('section');
      root.className = 'view';
      this.root.appendChild(root);
    }

    if (!page) {
      page = new PageClass(root);
      console.warn('[ROUTER] создал вьюху', page);
    }

    const redirectRoute = page.redirect(window.location.pathname);
    if (redirectRoute !== '') {
      console.warn('[ROUTER]', page.constructor.name + ' | redirectRoute: ' +
      redirectRoute);
      this.open(redirectRoute);
      this.routes[path] = {PageClass, page, root};
      return;
    }
    if (window.location.pathname !== link) {
      window.history.pushState(
          null,
          '',
          link,
      );
    }

    console.log('[ROUTER] !page.isActive():', !page.isActive());
    if (!page.isActive()) {
      Object.values(this.routes).forEach(({page}) => {
        if (page && page.isActive()) {
          page.hide();
        }
      });

      page.show();
    }

    this.routes[path] = {PageClass, page, root};
  }

  /**
   * Запуск ротуера. Отображение первого элемента, указанного в register()
   */
  start() {
    store.subscribe(routerTypes.REDIRECT, (to) => {
      this.open(to);
    });

    this.root.addEventListener('click', (event) => {
      const target = event.target;

      // ставим preventDefault, чтобы предотварить переход по ссылкам,
      // в которых есть вложенные элементы, ведь их href равен href'у ссылки
      // на всех вложенных элементах такой ссылки должен быть указан
      // data=router='ignore'
      // Нет гарантии, что сработает раньше: linkController или Router
      if (!(target instanceof HTMLAnchorElement ||
          target.dataset.router === 'ignore')) {
        return;
      }
      if (routerDebug) {
        console.warn('[ROUTER]', {target});
      }

      event.preventDefault();
      const link = target.pathname || target.parentElement.pathname;
      console.warn('link:', link);

      if (routerDebug) {
        console.log({pathname: link || '[ROUTER] empty path (ignored)'});
      }

      if (!link) {
        return;
      }

      this.open(link);
    });

    window.addEventListener('popstate', () => {
      const currentPath = window.location.pathname;
      this.open(currentPath);
    });

    const currentPath = window.location.pathname;
    console.log('[ROUTER] start page:', currentPath);
    this.open(currentPath);
  }
}
