export default class Router {
	constructor (root) {
		this.routes = {};
		this.root = root;
	}

	/**
	 * @param {string} path
	 * @param {BaseView} View
	 */
	register(path, View) {
		this.routes[ path ] = {
			View: View,
			view: null,
			el: null
		};

		return this;
	}

	/**
	 * @param {string} path
	 */
	open(path) {
		const route = this.routes[path];

		//TODO: check it with linkController
		if (!route) {
			this.open('/');
			return;
		}

		let {View, view, el} = route;

		if (!el) {
			el = document.createElement('section');
			this.root.appendChild(el);
		}

		if (!view) {
			view = new View(el);
		}

		// TODO: check how it works
		const redirectRoute = view.redirect(window.location.pathname); 
		if (redirectRoute !== '') {
			this.open(redirectRoute);
			// this.routes[path] = {View, view, el};
			return;
		}
		
		if (window.location.pathname !== path) {
			window.history.pushState(
				null,
				'',
				path
			);
		}

		if (!view.active) {
			Object.values(this.routes).forEach(({view}) => {
				if (view && view.active) {
					view.hide();
				}
			});

			view.show();
		}

		this.routes[path] = {View, view, el};
	}

	start() {
		this.root.addEventListener('click', function (event) {
			if (!(event.target instanceof HTMLAnchorElement)) {
				return;
			}

			event.preventDefault();
			const link = event.target;

			if (routerDebug) {
				console.log({pathname: link.pathname});
			}
			

			this.open(link.pathname);
		}.bind(this));

		window.addEventListener('popstate', function () {
			const currentPath = window.location.pathname;

			this.open(currentPath);
		}.bind(this));

		const currentPath = window.location.pathname;

		this.open(currentPath);
	}
}