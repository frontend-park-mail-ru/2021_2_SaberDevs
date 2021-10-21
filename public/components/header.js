import BaseComponent from './baseComponent.js';
import HeaderView from './headerView.js';

import store from '../flux/store.js';
import {mainPageActions} from '../flux/actions.js';
import {authorizationTypes} from '../flux/types.js';
/**
 * собирает все ссылочные элементы хедера в единый блок
 * @param {Array.Object<string, string, string>} linksArray
 * @return {HTMLDivElement}
 */
function headerNavLinkBar(linksArray) {
  const headerNavDiv = document.createElement('div');

  linksArray.map( (linkElement) => {
    const {href, name, section} = linkElement;

    const button = document.createElement('button');
    button.id = name;
    button.className = 'header-nav-link m-10';

    const headerNavLink = document.createElement('a');
    if (href) {
      headerNavLink.href = href;
    }
    headerNavLink.dataset.section = section;
    headerNavLink.textContent = name;

    button.appendChild(headerNavLink);

    headerNavDiv.appendChild(button);
  });
  return headerNavDiv;
}

/**
 * Заполняет правый row ссылками
 * @param {Array.Object<string, string, string>} linksArray
 */
function setHeaderLinks(linksArray) {
  const content = headerNavLinkBar(linksArray).outerHTML;
  // TODO: проверит как работает. Если что сделать мапку подписок компоненнов
  // и вызывать рендер меина
  const headerContent = document.getElementById('header-content');
  headerContent.innerHTML = content;
}

/**
 * ViewModel-компонент соответсвующего View
 * @class Header
 */
export default class Header extends BaseComponent {
  /**
   * Универсальный компонент заголовка
   */
  constructor() {
    super();
    this.view = new HeaderView();

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////
    this.unsubscribes.push(store.subscribe(authorizationTypes.LOGIN, () => {
      store.dispatch(
          mainPageActions.toggleLogin(
              true,
              store.getState().authorization.login,
          ),
      );
      setHeaderLinks(store.getState().mainPage.headerLinks);
    }));

    this.unsubscribes.push(store.subscribe(authorizationTypes.LOGOUT, () => {
      store.dispatch(mainPageActions.toggleLogin(false, ''));
      setHeaderLinks(store.getState().mainPage.headerLinks);
    }));
  }

  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    const state = store.getState().mainPage;

    let headerContent = '';
    // TODO: когда версточка будет готова
    // if (state.isAuthenticated) {
    //   headerContent = userPreviewComponent(
    // {url: `/profile/${authorizationState.login}`,
    //     name: authorizationState.name, img: authorizationState.avatar});
    // } else {
    //   headerContent = headerNavLinkBar(state.headerLinks).outerHTML;
    // }
    headerContent = headerNavLinkBar(state.headerLinks).outerHTML;
    this.root = this.view.render(headerContent);
    return this.root;
  }

  /**
   * Очистка памяти и отписка от связанных событий
   */
  destroy() {
    super.destroy();
  }
}
