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
//   },
// };

// ///////////////////////////////// //
//
//     Общий глобальный обработчик
//     действует только на ссылки
//
// ///////////////////////////////// //

function linksControllerClickHandler(e) {
  const {target} = e;

  // проверям, что клик был по ссылке (anchor)
  if (target instanceof HTMLAnchorElement) {
    e.preventDefault();

    if (linkControllerDebug) {
      console.log({targeter: target.dataset.section});
    }

    const props = configuration[target.dataset.section]?.props;
    const action = configuration[target.dataset.section]?.action;
    if (typeof action === 'function') {
      action.call(null, props);
    }
  }
}

export default class LinksController {
  constructor(root) {
    this.root = root;
    this.enabled = false;
  }

  register (section, action = () => {}, props = null) {
		configuration[section] = {
			action,
			props
		};

		return this;
	}

  enable() {
    if (!this.enabled) {
      this.enabled = true;
      this.root.addEventListener('click', linksControllerClickHandler);
    }
  }

  disable() {
    if (this.enabled) {
      this.enabled = false;
      this.root.removeEventListener('click', linksControllerClickHandler);
    }
  }
}