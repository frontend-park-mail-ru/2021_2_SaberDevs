const http = require('http'); // для работы с http
const fs = require('fs'); // для работы с файловой системой
const mime = require('mime/lite');

// ///////////////////////////////// //
//
//            Globals
//
// ///////////////////////////////// //

const page404 = fs.readFileSync('./public/404.html');
const CORS = '*';
const requestLenLimit = 1e6;
const APIUrls = ['/login', '/signup', '/getfeed'];
const feedChunkSize = 2;  // размер подгружаемой части ленты
const endOfFeedMarkerID = 'end';

// ///////////////////////////////// //
//
//           API messages
//
// ///////////////////////////////// //
/**
 * Ответ на API-call /getfeed
 * @typedef {Object} NewsRecordChunk
 * @property {string} from            - ID первой записи в блоке новостей
 * @property {string} to              - ID последней записи в блоке новостей
 * @property {Array.NewsRecord} chunk - feedChunkSize записей
 */

/**
 * Структура данных для представления пользователя
 * @typedef {Object} UserData
 * @property {string} login
 * @property {string} name
 * @property {string} surname
 * @property {string} email
 * @property {string} password
 * @property {number} score
 */
const users = {
  denistest: {
    login: 'DenisTest',
    name: 'Денис',
    surname: 'Турчин',
    email: 'd.turchin@mail.ru',
    password: 'DenisTest1',
    score: 3,
  },
};

/**
 * Представление записи
 * @typedef {Object} NewsRecord
 * @property {string} id           - ID записи
 * @property {string} previewUrl   - ссылка не главную картинку
 * @property {string} title        - заголовок
 * @property {string} text         - содержание записи
 * @property {string} authorUrl    - ссылка на страницу автора
 * @property {string} authorName   - имя автора
 * @property {string} authorAvatar - ссылка на аватар автора
 * @property {string} commentsUrl  - ссылка на комменарии к записи
 * @property {number} comments     - число комментариев к записи
 * @property {number} likes        - рейтинг записи
 * @property {Array.string} tags   - отмеченные автором темы сообщений
 */

const testData = [
  {
    id: '1',
    previewUrl: 'static/img/computer.png',
    tags: ['IT-News', 'Study'],
    title: '7 Skills of Highly Effective Programmers',
    text: 'Our team was inspired by the seven skills of highly effective' +
    'programmers created by the TechLead. We wanted to provide our own'+
    'take on the topic. Here are our seven skills of effective programmers...',
    authorUrl: '#',
    authorName: 'Григорий',
    authorAvatar: 'static/img/photo-elon-musk.jpg',
    commentsUrl: '#',
    comments: 97,
    likes: 10,
  },
  {
    id: '2',
    previewUrl: 'static/img/computer.png',
    tags: ['IT-News', 'Testing'],
    title: 'Article 1',
    text: `hello`,
    authorUrl: '#',
    authorName: 'Tester-1',
    authorAvatar: 'static/img/photo-elon-musk.jpg',
    commentsUrl: '#',
    comments: 1,
    likes: 1002,
  },
  {
    id: '3',
    previewUrl: 'static/img/computer.png',
    tags: ['IT-News', 'Testing'],
    title: 'Article 2',
    text: `hello`,
    authorUrl: '#',
    authorName: 'Tester-2',
    authorAvatar: 'static/img/photo-elon-musk.jpg',
    commentsUrl: '#',
    comments: 2,
    likes: 1002,
  },
  {
    id: '4',
    previewUrl: 'static/img/computer.png',
    tags: ['IT-News', 'Testing'],
    title: 'Article 3',
    text: `hello`,
    authorUrl: '#',
    authorName: 'Tester-3',
    authorAvatar: 'static/img/photo-elon-musk.jpg',
    commentsUrl: '#',
    comments: 3,
    likes: 1003,
  },
];

const endOfFeed = {
  id: endOfFeedMarkerID,
  previewUrl: 'static/img/endOfFeed.png',
  tags: ['Bottom'],
  title: 'А всё, а раньше надо было',
  text: '',
  authorUrl: '#',
  authorName: 'Tester-ender',
  authorAvatar: 'static/img/loader-1-HorizontalBalls.gif',
  commentsUrl: '#',
  comments: 0,
  likes: 0,
};

// ///////////////////////////////// //
//
//          utils
//
// ///////////////////////////////// //

/**
 * Готовит объект с информацией о пользователе для передачи клиенту
 * @param {UserData} login
 * @return {UserData} UserData withou`t password field
 */
function sendUserdata(login) {
  userData = Object.assign({}, users[login]);
  delete userData.password;
  return userData;
}

/**
 * Заполняет res сообщением об ошибке с кодом 400
 * @param {http.ServerResponse} res
 * @param {string} msg
 * @return {void}
 */
function fullfillError(res, msg) {
  console.log('\t\tresponse: 400 - ' + msg);
  res.writeHead(400);
  const resObj = {
    msg,
    data: null,
  };
  res.write(JSON.stringify(resObj));
  res.end();
}

/**
 * Заполняет res сообщением о неверном логине/пароле с кодом 400
 * @param {http.ServerResponse} res
 * @return {void}
 */
function fullfillIncorrectLogin(res) {
  fullfillError(res, 'Логин или пароль неверные');
}

/**
 * Заполняет res сообщением о занятом логине с кодом 400
 * @param {http.ServerResponse} res
 * @return {void}
 */
function fullfillLoginIsAlreadyTaken(res) {
  fullfillError(res, 'Этот логин уже занят');
}

/**
 * Заполняет res объектом {msg, data} с кодом 200
 * @param {http.ServerResponse} res
 * @param {string} msg
 * @param {Object} data
 * @return {void}
 */
function fullfillOKResponse(res, msg, data) {
  console.log('\t\tresponse: 200 - ' + msg);
  res.writeHead(200);
  const resObj = {
    msg,
    data,
  };
  res.write(JSON.stringify(resObj));
  res.end();
}

/**
 * Имитация похода в базу
 * @param {string} login
 * @param {string} idLastLoaded
 * @return {Promise.Array}
 */
function getFeedChunk(login, idLastLoaded) {
  let dataSource = [];
  if (login === 'all') {
    dataSource = testData;
  }
  if (idLastLoaded === endOfFeedMarkerID) {
    return new Promise((resolve) => resolve([]));
  }
  if (idLastLoaded === '') {
    return new Promise((r) => setTimeout(
        () => r(dataSource.slice(0, 2)), 2000),
    );
  }

  const dataChunk = [];
  for (let i=0; i < dataSource.length; i++) {
    if (dataSource[i].id === idLastLoaded) {
      let j=1;
      for (; i + j < dataSource.length && j <= feedChunkSize; j++) {
        dataChunk.push(dataSource[i+j]);
      }
      // если записи кончились
      if (i + j >= dataSource.length) {
        dataChunk.push(endOfFeed);
      }
      break;
    }
  }

  return new Promise((r) => setTimeout(() => r(dataChunk), 2000));
}

/**
 * Обрабатывает API
 * @param {http.Clientreq} req
 * @param {http.ServerResponse} res
 * @return {void}
 */
function executeAPICall(req, res) {
  let body = '';

  if (req.method !== 'GET' && req.method !== 'POST') {
    fullfillError(res, `${req.method}-API пока не поддерживается :3`);
    return;
  }

  // собираем все части сообщения, пока не получим все данные
  req.on('data', (data) => {
    body += data;

    // Too much POST data, kill the connection!
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > requestLenLimit) {
      req.connection.destroy();
      console.log('\t\tError: 1 Mb excided');
    }
  });

  req.on('end', async () => {
    res.setHeader('Content-Type', 'application/JSON');
    res.setHeader('Access-Control-Allow-Origin', CORS);

    console.log('\t\texecAPI. body: ' + body);
    const reqBody = JSON.parse(body);
    console.log('\t\treq body: ', reqBody);

    switch (req.method) {
      case 'POST':
        switch (req.url) {
          case '/login':
            const userData = users[reqBody.login.toLowerCase()];
            if (userData !== undefined) {
              console.log('\t\tUser has been found in db');

              if (userData.password === reqBody.password) {
                // TODO: setcookie
                // 3-й параметр: высылаем данные из БД на клиент
                // пароль на фронт не отправляем, лол))
                fullfillOKResponse(
                    res,
                    'Welcome back, ' + reqBody.login,
                    sendUserdata(reqBody.login.toLowerCase()),
                );
              } else {
                fullfillIncorrectLogin(res);
              }
            } else {
              fullfillIncorrectLogin(res);
            }
            break;

          case '/signup':
            // пользователь уже существует
            if (users[reqBody.login.toLowerCase()] !== undefined) {
              fullfillLoginIsAlreadyTaken(res);
            } else {
              // проверяем наличие все полей
              if (!('login' in reqBody &&
                  'password' in reqBody &&
                  'email' in reqBody)) {
                fullfillError(res, 'Не достаточно данных');
              } else {
                // пишем в базу
                users[reqBody.login.toLowerCase()] = {
                  password: reqBody.password,
                  email: reqBody.email,
                  score: 0,
                };
                // отвечаем, что регистрация успешна
                // TODO: server-side validation
                // TODO: setcookie
                // пароль на фронт не отправляем, лол))
                fullfillOKResponse(
                    res,
                    'Success! Welcome, ' + reqBody.login,
                    sendUserdata(reqBody.login.toLowerCase()),
                );
              }
            }
          case '/getfeed':
            if (!('idLastLoaded' in reqBody && 'login' in reqBody)) {
              fullfillError(res, 'Не достаточно данных');
              break;
            }
            await getFeedChunk(reqBody.login, reqBody.idLastLoaded)
                .then((nextChunk) => {
                  fullfillOKResponse(
                      res,
                      `feed uploaded to ${nextChunk.length > 0 ?
                        nextChunk[nextChunk.length-1].id : endOfFeedMarkerID}`,
                      {
                        from: nextChunk[0] === undefined ?
                          endOfFeedMarkerID : nextChunk[0].id,

                        to: nextChunk[nextChunk.length-1] === undefined ?
                        endOfFeedMarkerID : nextChunk[nextChunk.length-1].id,

                        chunk: nextChunk,
                      },
                  );
                })
                .catch(
                    () => {
                      fullfillError(res, 'База данных недоступна');
                    });
            break;
        }
        break;
      case 'GET':
        switch (req.url) {
        }
        break;
    }
  });
}

/**
 * Проверяет объект на равенство {}
 * @param {Object} obj
 * @return {boolean}
 */
function isEmptyObject(obj) {
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      return false;
    }
  }
  return true;
}

/**
 * Обрабатывает куки
 * @param {http.Clientreq} req
 * @return {array} массив полученных кук
 */
// Функция пока не используется. Еслинт такого не прощает
/* eslint-disable-next-line */
function parseCookies(req) {
  const list = {};
  rc = req.headers.cookie;

  rc &&
    rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

  if (!isEmptyObject(list)) {
    console.log('\t\tcookie found: ', JSON.stringify(list));
  }

  return list;
}

// ///////////////////////////////// //
//
//          Server
//
// ///////////////////////////////// //

const server = http.createServer((req, res) => {
  console.log('\turl: ' + req.url);

  // забираем урл загружаемого документа из GET запроса
  const path = req.url === '/' ? 'index.html' : req.url;
  // const cookies = parseCookies(req);

  // обработка апи. Если урл есть в массиве APIUrls, то это апи
  if (APIUrls.indexOf(req.url) != -1) {
    console.log('\t\tAPI call: ', path, ' | method: ', req.method);
    executeAPICall(req, res);
  } else {
    fs.readFile(`./public/${path}`, (err, data) => {
      if (err) {
        // вот тут отдать страничку 404
        data = page404;
      }

      console.log(
          'reqested: ',
          path,
          '| ext: ',
          path.slice(path.lastIndexOf('.') + 1),
          ' mime: ',
          mime.getType(path.slice(path.lastIndexOf('.') + 1)),
      );

      res.setHeader(
          'Content-Type',
          mime.getType(path.slice(path.lastIndexOf('.') + 1)),
      );
      // CORS
      res.setHeader('Access-Control-Allow-Origin', CORS);

      res.write(data);
      res.end();
    });
  }
});

const port = 8000;
console.log('listening on http://127.0.0.1:' + port);
server.listen(port);
