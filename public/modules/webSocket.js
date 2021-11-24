import streamCommentComponent from
  '../components/sidebar/streamComment.pug.js';

// Тачка Дорофеева
const APIurl = 'ws://89.208.197.247:8080/api/v1';
// Локальная разработка (Запусти node server/serverWs.js)
// const APIurl = 'ws://localhost:8082';

const webSocket = new WebSocket(APIurl);

webSocket.onopen = function(e) {
  console.log('webSocket: Соединение установлено');
};

webSocket.onmessage = function(event) {
  console.log(`webSocket: Данные получены с сервера: ${event.data}`);

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
    console.log(`webSocket: Соединение закрыто чисто, \
      код=${event.code} причина=${event.reason}`);
  } else {
    console.warn('Соединение прервано');
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
  const streamComments = document.querySelector('.sidebar__streams');
  const streamComment = streamCommentComponent({
    id: data.id,
    avatarUrl: data.author.avatarUrl,
    firstName: data.author.firstName,
    lastName: data.author.lastName,
    text: data.text,
  });

  streamComments.insertAdjacentHTML('afterbegin', streamComment);
}

export default webSocket;
