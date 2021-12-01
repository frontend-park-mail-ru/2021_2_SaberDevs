const ws = require('ws'); // для работы с вебсокетом

const serverWs = new ws.Server({port: 8082});
serverWs.on('connection', (webSocket) => {
  webSocket.send('Соединение с webscoket-сервером установлено');

  let id = 1;
  const timerId = setInterval(() => {
    const comment = {
      type: 'stream-comment',
      id: 'stream-comment' + id,
      text: 'text to stream-comment #' + id,
      author: {
        login: 'Elon' + id,
        firstName: 'Elon',
        lastName: 'Musk',
        avatarUrl: '../../static/img/users/user.jpg',
      },
    };
    id++;
    webSocket.send(JSON.stringify(comment));
  }, 2000);
  setTimeout(() => {
    clearInterval(timerId);
  }, 30000);
});

