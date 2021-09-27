// import headerComponent from '../components/header.pug.js';
// import sideBarComponent from '../components/sidebar.pug.js';
// import newsBarComponent from '../components/newsbar.js';
import cardComponent from '../components/card.pug.js';

import Ajax from '../modules/ajax.js';

// ///////////////////////////////// //
//
//          Globals
//
// ///////////////////////////////// //

const endOfFeedMarkerID = 'end';
const resetDoNotUploadTime = 60000;  // anti- ajax spam

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
 * @param {HTMLDivElement} trackedElement - отслеживаемый элемент.
 * Принимает данные с сервера в виде объекта согласно API сервера.
 */
// TODO: remove ^

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
export function uploadNextCards(state) {
  if (state.doNotUpload) {
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

    state.idLastLoaded = data.to;

    const trackedCard = document.getElementById(state.trackedCardId);
    const cards = data.chunk;

    if (cards instanceof Array) {
      cards.forEach((element) => {
        // сохраняем карточку
        state.cards.push(element);
        // рисуем
        trackedCard.insertAdjacentHTML(
            'beforebegin',
            cardComponent(element),
        );
      });
    } else {
      console.log('API ERROR! Server must return NewsRecordChunk');
    }

    if (data.to === endOfFeedMarkerID) {
      // hide loading component
      trackedCard.style.visibility = 'hidden';
      if (ajaxDebug) {
        console.log('\'end\' found. doNotUpload flag is set to true');
      }
      state.doNotUpload = true;
      setTimeout(() => {
        if (ajaxDebug) {
          console.log('doNotUpload flag is reset to false');
        }
        state.doNotUpload = false;
      }, resetDoNotUploadTime);
    }
  };

  state.isLoading = true;

  Ajax.get({
    url: `/feed?idLastLoaded=${state.idLastLoaded ? state.idLastLoaded : 0}` +
      '&login=' +
      (state.login === '' ? 'all' : state.login),
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

  // root.innerHTML += headerComponent({content: headerContent});
  // root.innerHTML += newsBarComponent({content: props.news});

  const mainContainer = document.createElement('main');
  mainContainer.className = 'container';
  // mainContainer.innerHTML += sideBarComponent({content: props.sideBarLinks});

  const contentDiv = document.createElement('div');
  contentDiv.className = 'content col';
  contentDiv.id = 'menu-content-block';

  contentDiv.innerHTML += cardComponent(loadingCard);

  mainContainer.appendChild(contentDiv);
  root.appendChild(mainContainer);

  const trackedCard = document.getElementById(props.state.trackedCardId);

  if (JSON.stringify(props.state.cards) === '[]') {
    // подгружаем первые карточки при первом рендере
    uploadNextCards(props.state);
  } else {
    props.state.cards.forEach((element) => {
      trackedCard.insertAdjacentHTML(
          'beforebegin',
          cardComponent(element),
      );
    });
  }

  // создаем такой коллбек, который можно будет удалить в меине
  // это обертка функции в (event) => undefined
  // newsFeedEndReachEventAction = (event) => {
  //   // работаем, только если отслеживаемый элемент
  //   // находися в области видимости пользователя
  //   if (props.state.isLoading ||
  //     trackedCard.getBoundingClientRect().y > Utils.getUserWindowHeight()) {
  //     return;
  //   }
  //   console.log('scroll trigger');
  //   uploadNextCards(props.state);
  // };

  window.addEventListener(
      'scroll',
      props.newsFeedEndReachEventAction,
      false,
  );
}

