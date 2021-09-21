const http = require('http'); // для работы с http
const fs = require('fs'); // для работы с файловой системой
const mime = require('mime/lite');

// ///////////////////////////////// //
//
//            Globals
//
// ///////////////////////////////// //

// мы знаем, что код тут не упадет, т.к. страница существует
const page404 = fs.readFileSync('./public/404.html');
const CORS = '*';
/* eslint-disable-next-line */
const REQ_LEN_LIMIT = 1e6;
const APIUrls = ['/login', '/signup'];

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

// ///////////////////////////////// //
//
//          utils
//
// ///////////////////////////////// //

/**
 * Готовит объект с информацией о пользователе для передачи клиенту
 * @param {UserData} login
 * @return {UserData} without password field
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
 * Обрабатывает API
 * @param {http.Clientreq} req
 * @param {http.ServerResponse} res
 * @return {void}
 */
function executeAPICall(req, res) {
  if (req.method == 'POST') {
    let body = '';

    // собираем все части сообщения, пока не получим все данные
    req.on('data', (data) => {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > REQ_LEN_LIMIT) {
        req.connection.destroy();
        console.log('\t\tError: 1 Mb excided');
      }
    });

    req.on('end', () => {
      res.setHeader('Content-Type', 'application/JSON');
      res.setHeader('Access-Control-Allow-Origin', CORS);

      // returns object
      const reqBody = JSON.parse(body);
      console.log('\t\treq body: ', reqBody);

      if (req.url === '/login') {
        if (users[reqBody.login.toLowerCase()] !== undefined) {
          console.log('\t\tUser has been found in db');

          if (users[reqBody.login].password === reqBody.password) {
            // TODO: setcookie
            // 3-й параметр: высылаем данные из БД на клиент
            // пароль на фронт не отправляем, лол))
            fullfillOKResponse(
                res,
                'Welcome back, ' + reqBody.login,
                sendUserdata(reqBody.login),
            );
          } else {
            fullfillIncorrectLogin(res);
          }
        } else {
          fullfillIncorrectLogin(res);
        }
      }
      if (req.url === '/signup') {
        // пользователь уже существует
        if (users[reqBody.login.toLowerCase()] !== undefined) {
          fullfillLoginIsAlreadyTaken(res);
        } else {
          // проверяем наличие все полей
          if (
            !(
              'login' in reqBody &&
              'password' in reqBody &&
              'email' in reqBody
            )
          ) {
            fullfillError(res, 'Не достаточно данных');
          } else {
            // пишем в базу
            users[reqBody.login] = {
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
                sendUserdata(reqBody.login),
            );
          }
        }
      }
    });
  } else {
    fullfillError(res, 'GET API пока не поддерживается :3');
  }
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
