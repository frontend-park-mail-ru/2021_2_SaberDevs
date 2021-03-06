import store from '../flux/store.js';
import {routerTypes} from '../flux/types.js';
import {routerDebug} from '../globals.js';

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
    // this.routes.filter = (predicate) =>
    //   Object.keys(this.routes)
    //       .filter( (key) => predicate(this.routes[key]) )
    //       .reduce( (res, key) => (res[key] = this.routes[key], res), {} );
    // this.pageInstances = [];
  }

  /**
   * @param {string} path
   * @param {BasePageMV} PageClass
   * @return {Router}
   */
  register(path, PageClass) {
    for (const registredPath in this.routes) {
      // Этот инстанс уже был зарегистрирован по другим путем
      if (this.routes[registredPath].PageClass === PageClass) {
        console.warn(`[ROUTER] paths ${registredPath} and ${path} point to ` +
            `the same ${PageClass.name}`);
        // чтобы объект по path и registredPath был одним и тем же
        this.routes[path] = this.routes[registredPath];
        return this;
      }
    }

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

    for (const registredPath in this.routes) {
      // Этот инстанс уже был зарегистрирован по другим путем
      if (this.routes[registredPath].PageClass === PageClass) {
        console.warn(`[ROUTER] paths ${registredPath} and ${path} point to ` +
            `the same ${PageClass.name}`);
        // чтобы объект по path и registredPath был одним и тем же
        this.routes[path] = this.routes[registredPath];
        return this;
      }
    }

    this.routes[path] = {
      PageClass,
      page: null,
      root: null,
    };

    return this;
  }

  /**
   * @param {string} link
   * @param {Object?} params
   * @property {string?} anchor  // якорь URL
   * @property {string?} query   // query-параметры URL
   * @property {string} href     // запись в историю
   */
  open(link, params) {
    let path = link;
    const {href, anchor} = params || {href: null, anchor: null};
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
          href || link,
      );
    }

    const isInactive = !page.isActive();
    console.log('[ROUTER] !page.isActive():', isInactive);
    if (isInactive) {
      Object.values(this.routes).forEach(({page}) => {
        if (page && page.isActive()) {
          page.hide();
        }
      });

      page.show();
      if (anchor) {
        console.warn('[ROUTER] поиск якоря', anchor);
        root.querySelector(`a[name=${anchor}]`)?.scrollIntoView();
      }
    }

    // сохраняем изменения в объекте не разрушая объекте
    // это важно для сохранения ссылок нескольких
    // путей на одну страницу
    this.routes[path].page = page;
    this.routes[path].root = root;
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
          target.dataset.router === 'ignore') ||
          target.dataset.router === 'outer') {
        return;
      }
      if (routerDebug) {
        console.warn('[ROUTER]', {target});
      }

      event.preventDefault();
      const link = target.pathname || target.parentElement.pathname;
      const anchor = target.hash?.substr(1);
      const query = target.search;
      const href = target.href;

      if (routerDebug) {
        console.warn(
            '[ROUTER] link:', link || 'empty path (ignored)',
            `${anchor ? ('anchor: ' + anchor) : ''}`,
            `${query ? ('query: ' + query) : ''}`,
        );
      }

      if (!link) {
        return;
      }

      this.open(link, {anchor, query, href});
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
