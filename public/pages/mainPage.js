import headerComponent from '../components/header.pug.js';
import sideBarComponent from '../components/sidebar.pug.js';
// import newsBarComponent from '../components/newsbar.js';
import cardComponent from '../components/card.pug.js';
import userPreviewComponent from '../components/userPreview.pug.js'
import modalComponent from '../components/modal.js';

import store from '../flux/store.js';
import {mainPageActions, changePageActions} from '../flux/actions.js';
import { authorizationTypes, changePageTypes } from '../flux/types.js';

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
 * @param {Object} state
 * @property {string} trackedCardId - ID элемента, при появлении
 * которого в области видимости, будет происходить подгрузка
 * @property {string} idLastLoaded - ID элемента ленты новостей, который
 * был загружен последним в пердыдущий раз. Лента будет загружаться
 * с этой новости
 * @property {string} login - пользователя, для которого составлена подборка
 */
export function uploadNextCards() {
  const state = store.getState().mainPage;

  if (state.doNotUpload || state.isLoading) {
    if (ajaxDebug) {
      console.log('can\'t load news as doNotUpload state flag is true');
    }
    return;
  }

  // создаем обработчик для ответа с сервера (для краткости)
  const onLoad = (data) => {
    if (ajaxDebug) {
      console.log('more news loaded!');
    }

    const trackedCard = document.getElementById(state.trackedCardId);
    const cards = data;

    if (cards instanceof Array) {
      cards.forEach((element) => {
        trackedCard.insertAdjacentHTML(
            'beforebegin',
            cardComponent(element),
        );
      });
      if (cards.length > 0) {
        store.dispatch(mainPageActions.saveNewCards(cards[cards.length - 1].id, cards));
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
    callback: (status, msg) => {
      let response = {};
      try {
        response = JSON.parse(msg);
        if (status === Ajax.STATUS.ok) {
          onLoad(response.data);
          return;
        }

        modalComponent.setTitle(`Ошибка сети ${status}`);
        modalComponent.setContent(response.msg);
        modalComponent.open(false);
      } catch (e) {
        console.warn('Error. response is not JSON or ' + e);
      }
    },
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
    headerNavLink.href = href;
    headerNavLink.dataset.section = section;
    headerNavLink.textContent = name;

    button.appendChild(headerNavLink);

    headerNavDiv.appendChild(button);
  });
  return headerNavDiv;
}

// создаем такой обработчик, который можно будет удалить
// это обертка функции в (event) => undefined
function newsFeedEndReachEventAction(event) {
  const state = store.getState().mainPage
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
 * импортирует root-элемент, через замыкание
 *
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
 * Элементы хедера определяются текущим состоянием.
 * для нее обязательны следующие поля
 *
 * @param {Object} props
 * @property {Array.HTMLAnchorElement} headerLinks
 * @property {Array.HTMLAnchorElement} sideBarLinks
 * @property {boolean} isAuthenticated true - в хедере показывается иконка
 * пользователя, доступен переход в профиль false - ссылки логин/регистрация
 * @property {UserData} userData
 * @property {MainCardState} state глобальное состояние ленты новостей
 * @return {void}
 */
export default function mainPage() {
  store.dispatch(changePageActions.changePage('main'));
  const state = store.getState().mainPage;
  const authorizationState = store.getState().authorization;

  store.subscribe(authorizationTypes.LOGIN, () => {
  store.dispatch(mainPageActions.toggle_login(true, store.getState().authorization.login));
    setHeaderLinks(store.getState().mainPage.headerLinks);
  });

  store.subscribe(authorizationTypes.LOGOUT, () => {
    store.dispatch(mainPageActions.toggle_login(false, ''));
    setHeaderLinks(store.getState().mainPage.headerLinks);
  });

  store.subscribe(changePageTypes.CHANGE_PAGE, () => {
    window.removeEventListener(
      'scroll',
      newsFeedEndReachEventAction,
      false,
    );
  });

  window.addEventListener(
    'scroll',
    newsFeedEndReachEventAction,
    false,
  );

  root.innerHTML = '';
  document.title = 'SaberProject';

  let headerContent = '';

  // TODO:
  // if (state.isAuthenticated) {
  //   headerContent = userPreviewComponent({url: `/profile/${authorizationState.login}`,
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

  contentDiv.innerHTML += cardComponent(loadingCard);

  mainContainer.appendChild(contentDiv);
  root.appendChild(mainContainer);

  const trackedCard = document.getElementById(state.trackedCardId);

  if (JSON.stringify(state.cards) === '[]') {
    // подгружаем первые карточки при первом рендере
    uploadNextCards();
  } else {
    state.cards.forEach((element) => {
      trackedCard.insertAdjacentHTML(
          'beforebegin',
          cardComponent(element),
      );
    });
  }
}

/**
 * Заполняет правый row произвольным контентом
 * @param {string} content
 */
export function setHeaderContent(content) {
  console.log('setHeaderContent: ' + content);
  const headerContent = document.getElementById('header-content');
  headerContent.innerHTML = content;
}

/**
 * Заполняет правый row ссылками
 * @param {Array.Object<string, string, string>} linksArray
 */
export function setHeaderLinks(linksArray) {
  const content = headerNavLinkBar(linksArray).outerHTML;
  setHeaderContent(content);
}
