import headerComponent from '../components/header.pug.js';
import sideBarComponent from '../components/sidebar.pug.js';
// import newsBarComponent from '../components/newsbar.js';
import cardComponent from '../components/card.pug.js';

import Utils from '../utils.js';
import Ajax from '../modules/ajax.js';

// ///////////////////////////////// //
//
//          Globals
//
// ///////////////////////////////// //

/**
 * Выполняется, если вход успешный
 * @callback LoadCallback
 * @param {Object} props
 */

const endOfFeedMarkerID = 'end';

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
 * Обработчик события scroll для главной страницы
 * @param {Object} state
 * @property {string} trackedCardId - ID элемента, при появлении
 * которого в области видимости, будет происходить подгрузка
 * @property {string} idLastLoaded - ID элемента ленты новостей, который
 * был загружен последним в пердыдущий раз. Лента будет загружаться
 * с этой новости
 * @property {string} login - пользователя, для которого составлена подборка
 *
 * @param {LoadCallback} onLoad - обработчик события загрузки.
 * Принимает данные с сервера в виде объекта согласно API сервера.
 */
export function newsFeenEndReachEventAction(state, onLoad) {
  const trackedCard = document.getElementById(state.trackedCardId);

  if (!state.isLoading &&
    trackedCard.getBoundingClientRect().y <= Utils.getUserWindowHeight()) {
    console.log('scroll trigger');
    state.isLoading = true;

    Ajax.post({
      url: '/getfeed',
      body: {
        idLastLoaded: state.idLastLoaded,
        login: state.login === '' ? 'all' : state.login,
      },
      callback: (status, msg) => {
        if (status === Ajax.STATUS.ok) {
          state.isLoading = false;
          onLoad(JSON.parse(msg).data);
          return;
        }
        // TODO: raise popup
        alert('ошибка сети' + status + '\n' + msg);
      },
    });
  }
}

/**
 * Получить feedChunkSize записей (настрйока для сервера)
 * @param {Object} state
 * @property {string} trackedCardId - ID элемента, при появлении
 * которого в области видимости, будет происходить подгрузка
 * @property {string} idLastLoaded - ID элемента ленты новостей, который
 * был загружен последним в пердыдущий раз. Лента будет загружаться
 * с этой новости
 * @property {string} login - пользователя, для которого составлена подборка
 */
export function uploadNextCards(state) {
  newsFeenEndReachEventAction(
      state,
      (data) => {
        const cards = data.chunk;
        state.idLastLoaded = data.to;
        // TODO: check if card is array!
        console.log('more news loaded!');
        const trackedCard = document.getElementById(
            state.trackedCardId,
        );
        cards.forEach((element) => {
          trackedCard.insertAdjacentHTML(
              'beforebegin',
              cardComponent(element),
          );
        });
        if (data.to === endOfFeedMarkerID) {
          // hide loading component
          trackedCard.style.display = 'none';
        }
      });
}

// ///////////////////////////////// //
//
//              Main Page
//
// ///////////////////////////////// //

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
 * @property {Object} state глобальное состояние ленты новостей
 * @return {void}
 */
export default function mainPage(props) {
  root.innerHTML = '';
  document.title = 'SaberProject';

  let headerContent = '';

  if (props.isAuthenticated) {
    headerContent = userPreviewHeader({url: `/profile/${props.userData.login}`,
      name: props.userData.name, img: props.userData.avatar});
  } else {
    // TODO: отдельный шаблон
    const headerNavDIv = document.createElement('div');

    props.headerLinks.map((link) => {
      headerNavDIv.appendChild(link);
    });

    headerContent = headerNavDIv.outerHTML;
  }

  if (headerDebug) {
    console.log('headerContent: ', headerContent);
  }

  // TODO: убрать, когда будет использован шаблон хедера
  root.innerHTML += '<p>test</p>';
  root.innerHTML += headerContent;

  root.innerHTML += headerComponent({content: headerContent});
  // TODO: append this components
  // root.innerHTML += newsBarComponent({content: props.news});

  const mainContainer = document.createElement('main');
  mainContainer.className = 'container';
  mainContainer.innerHTML += sideBarComponent({content: props.sideBarLinks});

  const contentDiv = document.createElement('div');
  contentDiv.className = 'content col';
  contentDiv.id = 'menu-content-block';

  contentDiv.innerHTML += cardComponent(loadingCard);

  mainContainer.appendChild(contentDiv);
  root.appendChild(mainContainer);

  window.addEventListener(
      'scroll',
      () => uploadNextCards(props.state),
  );
}
