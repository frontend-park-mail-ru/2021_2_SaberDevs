import {appendApiImg} from '../common/transformApi.js';

import store from '../flux/store.js';
import streamActions from '../flux/actions/streamActions.js';

import {wsDebug} from '../globals.js';
// Тачка Дорофеева
const APIurl = 'wss://sabernews.ru/api/v1/ws';
// Локальная разработка (Запусти node server/serverWs.js)
// const APIurl = 'ws://localhost:8082';

let webSocket = null;

const retryDelay = 10000;

/**
 * @class
 */
export default class WS {
  /**
   * стартует WS соединение с сервером и грузит стримы
   * @param {boolean} doRetry
   */
  static init(doRetry = true) {
    if (webSocket === null) {
      webSocket = new WebSocket(APIurl);
    }

    webSocket.onopen = function(e) {
      if (wsDebug) {
        console.log('[WS]: Соединение установлено');
      }
    };

    webSocket.onmessage = function(event) {
      if (wsDebug) {
        console.log(`[WS]: Данные получены с сервера: ${event.data}`);
      }

      let data = '';
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.warn(e.message);
        return;
      }

      // логика тут
      if (data.type = 'stream-comment') {
        addStreamComment(data);
      }
    };

    webSocket.onclose = function(event) {
      if (event.wasClean) {
        if (wsDebug) {
          console.log(`[WS] Соединение закрыто чисто, \
          код=${event.code} причина=${event.reason}`);
          webSocket = null;
        }
      } else {
        if (wsDebug) {
          console.warn('Соединение прервано');
          webSocket = null;
        }
        if (doRetry) {
          if (wsDebug) {
            console.log('[WS] восстанавливаю соединение');
          }
          setTimeout(() => WS.init(), retryDelay);
        }
      }
    };

    webSocket.onerror = function(error) {
      console.warn(`webSocket: error: ${error.message}`);
    };
  }

  /**
   * закрываем
   */
  static close() {
    webSocket.close();
  }
}

/**
 * Добавляет стрим-комментарий
 * @param {Object} data
 */
function addStreamComment(data) {
  appendApiImg(data.author);
  store.dispatch(streamActions.saveNewComments([data]));
}
