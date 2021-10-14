import BaseView from './baseView.js';

import headerComponent from '../components/header.pug.js';
import sideBarComponent from '../components/sidebar.pug.js';
import cardComponent from '../components/card.pug.js';
// import newsBarComponent from '../components/newsbar.js';
// import userPreviewComponent from '../components/userPreview.pug.js'
import modalComponent from '../components/modal.js';

import store from '../flux/store.js';
import {mainPageActions, changePageActions} from '../flux/actions.js';
import {authorizationTypes, changePageTypes} from '../flux/types.js';

import Ajax from '../modules/ajax.js';
import Utils from '../utils.js';

// ///////////////////////////////// //
//
//          Globals
//
// ///////////////////////////////// //

const endOfFeedMarkerID = 'end';
const resetDoNotUploadTime = 60000;  // anti- brutforce

const loadingCard = {
  id: 'loading-card',
  previewUrl: 'static/img/loader-1-HorizontalBalls.gif',
  tags: [],
  title: 'Загрузка...',
  text: `Еще чуть-чуть...`,
  authorUrl: '',
  authorName: 'loading',
  authorAvatar: '',
  commentsUrl: '',
};

/**
 * Получить feedChunkSize записей (настройка на стороне сервера)
 * и отрисовать их перед loadingCard
 */
function uploadNextCards() {
  const state = store.getState().mainPage;

  if (state.doNotUpload || state.isLoading) {
    if (ajaxDebug) {
      console.log('can\'t load news as doNotUpload state flag is true');
    }
    return;
  }

  /**
   * Обработчик для ответа с сервера
   * @param {Object} data
   */
  function onLoad(data) {
    if (ajaxDebug) {
      console.log('more news loaded!');
      console.log({data});
    }

    const trackedCard = document.getElementById(state.trackedCardId);
    const cards = data;

    console.log(trackedCard);
    if (cards instanceof Array) {
      cards.forEach((element) => {
        trackedCard.insertAdjacentHTML(
            'beforebegin',
            cardComponent(element),
        );
      });
      if (cards.length > 0) {
        store.dispatch(
            mainPageActions.saveNewCards(cards[cards.length - 1].id, cards),
        );
      }
    } else {
      console.warn('API ERROR! Server must return NewsRecordChunk');
    }

    if (cards[cards.length - 1]?.id === endOfFeedMarkerID) {
      // hide loading component
      trackedCard.style.visibility = 'hidden';
      if (ajaxDebug) {
        console.log('\'end\' found. doNotUpload flag is set to true');
      }
      store.dispatch(mainPageActions.forbidCardsLoading());
      setTimeout(() => {
        if (ajaxDebug) {
          console.log('doNotUpload flag is reset to false');
        }
        store.dispatch(mainPageActions.allowCardsLoading());
      }, resetDoNotUploadTime);
    }
  };

  store.dispatch(mainPageActions.setLoadingFlag());

  Ajax.get({
    url: `/feed?idLastLoaded=${state.idLastLoaded || ''}` +
      '&login=' +
      (state.login === '' ? 'all' : state.login),
  })
      .then(({status, response}) => {
        if (status === Ajax.STATUS.ok) {
          onLoad(response.data);
          return;
        }

        modalComponent.setTitle(`Ошибка сети ${status}`);
        modalComponent.setContent(response.msg);
        modalComponent.open(false);
      });
}

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
 * Заполняет правый row произвольным контентом
 * @param {string} content
 */
function setHeaderContent(content) {
  const headerContent = document.getElementById('header-content');
  headerContent.innerHTML = content;
}

/**
 * Заполняет правый row ссылками
 * @param {Array.Object<string, string, string>} linksArray
 */
function setHeaderLinks(linksArray) {
  const content = headerNavLinkBar(linksArray).outerHTML;
  setHeaderContent(content);
}

/**
 * Обработчик scroll, который можно будет удалить
 * Проверяет, достигнут ли конец ленты
 * @param {event} event
 */
function newsFeedEndReachEventAction(event) {
  const state = store.getState().mainPage;
  const trackedCard = document.getElementById(
      state.trackedCardId,
  );
  // работаем, только если отслеживаемый элемент
  // находися в области видимости пользователя
  if (state.isLoading ||
    trackedCard.getBoundingClientRect().y>Utils.getUserWindowHeight()) {
    return;
  }
  console.log('scroll trigger');
  uploadNextCards();
}

// ///////////////////////////////// //
//
//              Main Page
//
// ///////////////////////////////// //

/**
 * Объект состояния на главной странице
 * @typedef {Object} MainCardState
 * @property {string} trackedCardId - ID карточки, которая при попадании
 *                                    в область видимости пользователя
 *                                    вызовет подгрузку новостей
 * @property {string} idLastLoaded  - ID последней загруженной карточки
 * @property {string} login         - пользователь, для которого запрашивается
 *                                    подборка новостей
 * @property {boolean} isLoading    - Идет ли загрузка сейчас. true запрещает
 *                                    отправку запросов на обновлении ленты,
 *                                    чтобы не спамить сервер
 * @property {number} lastScrollPos - Позиция скролла при покидании mainPage
 * @property {boolean} doNotUpload  - Запрещает загрузку при обнаружении конца
 *                                    ленты, чтобы не спамить сервер.
 *                                    Сбразывется через resetDoNotUploadTime мс
 * @property {Array.NewsCard} cards - Массив загруженных карточек для
 *                                    восстановления состояния при возвращении
 *                                    на MainPage
 */

/**
 * @class MainPage
 * @module MainPage
 */
export default class MainPage extends BaseView {
  /**
   * @param {HTMLElement} rootElement
   */
  constructor(rootElement) {
    super(rootElement);
    this.render = render;
    this.loginUnsubscribe = null;
    this.logoutUnsubscribe = null;

    store.subscribe(changePageTypes.CHANGE_PAGE, () => {
      window.removeEventListener(
          'scroll',
          newsFeedEndReachEventAction,
          false,
      );
    });
  }

  /**
   * Показать элемент. Вызывает render() для обновления.
   */
  show() {
    super.show();
    if (routerDebug) {
      console.log('MainPage show');
    }
  }

  /**
   * Скрыть элемент
   */
  hide() {
    super.hide();
    if (routerDebug) {
      console.log('MainPage hide');
    }
    if (this.loginUnsubscribe) {
      this.loginUnsubscribe();
      this.loginUnsubscribe = null;
    }
    if (this.logoutUnsubscribe) {
      this.logoutUnsubscribe();
      this.logoutUnsubscribe = null;
    }
  }

  /**
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
 */
  render() {
    if (routerDebug) {
      console.log('MainPage render');
    }
    const root = this.rootElement;
    store.dispatch(changePageActions.changePage('main', 'SaberProject'));
    const state = store.getState().mainPage;
    // const authorizationState = store.getState().authorization;

    this.loginUnsubscribe = store.subscribe(authorizationTypes.LOGIN, () => {
      store.dispatch(
          mainPageActions.toggleLogin(
              true,
              store.getState().authorization.login,
          ),
      );
      setHeaderLinks(store.getState().mainPage.headerLinks);
    });

    this.logoutUnsubscribe = store.subscribe(authorizationTypes.LOGOUT, () => {
      store.dispatch(mainPageActions.toggleLogin(false, ''));
      setHeaderLinks(store.getState().mainPage.headerLinks);
    });

    window.addEventListener(
        'scroll',
        newsFeedEndReachEventAction,
        false,
    );

    root.innerHTML = '';

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

    if (headerDebug) {
      console.log('headerContent: ', headerContent);
    }

    root.innerHTML += headerComponent({content: headerContent});
    // root.innerHTML += newsBarComponent({content: props.news});

    const mainContainer = document.createElement('main');
    mainContainer.className = 'container';
    mainContainer.innerHTML += sideBarComponent({content: state.sideBarLinks});

    const contentDiv = document.createElement('div');
    contentDiv.className = 'content col';
    contentDiv.id = 'menu-content-block';

    if (JSON.stringify(state.cards) === '[]') {
      uploadNextCards();
    }
    state.cards.forEach((element) => {
      contentDiv.innerHTML += cardComponent(element);
    });

    contentDiv.innerHTML += cardComponent(loadingCard);

    mainContainer.appendChild(contentDiv);
    root.appendChild(mainContainer);
  }
}
