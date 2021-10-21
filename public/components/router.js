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
    this.root = root;
  }

  /**
   * @param {string} path
   * @param {BasePageMV} ViewClass
   * @return {Router}
   */
  register(path, ViewClass) {
    this.routes[path] = {
      ViewClass,
      viewInstance: null,
      rootElement: null,
    };

    return this;
  }

  /**
   * @param {string} path
   */
  open(path) {
    const route = this.routes[path];

    if (!route) {
      this.open('/');
      return;
    }

    let {ViewClass, viewInstance, rootElement} = route;

    if (!rootElement) {
      rootElement = document.createElement('section');
      this.root.appendChild(rootElement);
    }

    if (!viewInstance) {
      viewInstance = new ViewClass(rootElement);
    }

    const redirectRoute = viewInstance.redirect(window.location.pathname);
    if (redirectRoute !== '') {
      console.warn(viewInstance.constructor.name + ' | redirectRoute: ' +
      redirectRoute);
      this.open(redirectRoute);
      this.routes[path] = {ViewClass, viewInstance, rootElement};
      return;
    }
    if (window.location.pathname !== path) {
      window.history.pushState(
          null,
          '',
          path,
      );
    }

    if (!viewInstance.isActive()) {
      Object.values(this.routes).forEach(({viewInstance}) => {
        if (viewInstance && viewInstance.isActive()) {
          viewInstance.hide();
        }
      });

      viewInstance.show();
    }

    this.routes[path] = {ViewClass, viewInstance, rootElement};
  }

  /**
   * Запуск ротуера. Отображение первого элемента, указанного в register()
   */
  start() {
    this.root.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLAnchorElement)) {
        return;
      }

      event.preventDefault();
      const link = event.target.pathname;

      if (routerDebug) {
        console.log({pathname: link});
      }

      this.open(link);
    });

    window.addEventListener('popstate', () => {
      const currentPath = window.location.pathname;

      this.open(currentPath);
    });

    const currentPath = window.location.pathname;
    console.warn(currentPath);
    this.open(currentPath);
  }
}
