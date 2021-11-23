const ws = require('ws'); // для работы с вебсокетом

// const ip = 'localhost';

const serverWs = new ws.Server({port: 8082});
serverWs.on('connection', (webSocket) => {
  webSocket.send('Соединение с сервером установлено');
});

