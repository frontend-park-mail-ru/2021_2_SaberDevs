import {appendApiImg} from '../common/transformApi.js';

import store from '../flux/store.js';
import streamActions from '../flux/actions/streamActions.js';

// Тачка Дорофеева
const APIurl = 'ws://89.208.197.247:8081/api/v1/ws';
// Локальная разработка (Запусти node server/serverWs.js)
// const APIurl = 'ws://localhost:8082';

const webSocket = new WebSocket(APIurl);

webSocket.onopen = function(e) {
  if (wsDebug) {
    console.log('webSocket: Соединение установлено');
  }
};

webSocket.onmessage = function(event) {
  if (wsDebug) {
    console.log(`webSocket: Данные получены с сервера: ${event.data}`);
  }

  let data = '';
  try {
    data = JSON.parse(event.data);
  } catch (e) {
    console.warn(e.message);
    return;
  }

  if (data.type = 'stream-comment') {
    addStreamComment(data);
  }
};

webSocket.onclose = function(event) {
  if (event.wasClean) {
    if (wsDebug) {
      console.log(`webSocket: Соединение закрыто чисто, \
      код=${event.code} причина=${event.reason}`);
    }
  } else {
    if (wsDebug) {
      console.warn('Соединение прервано');
    }
  }
};

webSocket.onerror = function(error) {
  console.warn(`webSocket: error: ${error.message}`);
};

/**
 * Добавляет стрим-комментарий
 * @param {Object} data
 */
function addStreamComment(data) {
  appendApiImg(data.author);
  store.dispatch(streamActions.saveNewComments([data]));
}

export default webSocket;
