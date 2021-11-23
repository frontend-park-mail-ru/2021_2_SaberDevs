const APIurl = 'ws://localhost:8082';

const webSocket = new WebSocket(APIurl);

webSocket.onopen = function(e) {
  alert('webSocket: Соединение установлено');
};

webSocket.onmessage = function(event) {
  alert(`webSocket: Данные получены с сервера: ${event.data}`);
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

export default webSocket;
