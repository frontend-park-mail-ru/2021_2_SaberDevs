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
   * @param {BaseView} ViewClass
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

    // TODO: check it with linkController
    if (!route) {
      this.open('/');
      return;
    }

    let {ViewClass, viewinstance, rootElement} = route;

    if (!rootElement) {
      rootElement = document.createElement('section');
      this.root.appendChild(rootElement);
    }

    if (!viewinstance) {
      viewinstance = new ViewClass(rootElement);
    }

    // TODO: check how it works
    const redirectRoute = viewinstance.redirect(window.location.pathname);
    if (redirectRoute !== '') {
      this.open(redirectRoute);
      // this.routes[path] = {ViewClass, viewinstance, rootElement};
      return;
    }

    if (window.location.pathname !== path) {
      window.history.pushState(
          null,
          '',
          path,
      );
    }

    if (!viewinstance.isActive()) {
      Object.values(this.routes).forEach(({viewinstance}) => {
        if (viewinstance && viewinstance.isActive()) {
          viewinstance.hide();
        }
      });

      viewinstance.show();
    }

    this.routes[path] = {ViewClass, viewinstance, rootElement};
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

    this.open(currentPath);
  }
}
