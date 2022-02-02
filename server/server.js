const http = require('http'); // для работы с http
const fs = require('fs'); // для работы с файловой системой
const mime = require('mime/lite');

// ///////////////////////////////// //
//
//               Globals
//
// ///////////////////////////////// //


const port = 8080;

// Поменять тут, в public/modules/ajax, server/server-api.js (не забыть CORS)

// Больше не используется. Сервер чисто для локальной разработки
// тачка Дмитрия Дорофеева
// const ip = '192.168.0.31';
//
// локальная разработка
const ip = 'localhost';

// ///////////////////////////////// //
//
//           Application
//
// ///////////////////////////////// //

// /////////   WebPack   ///////// //
const NO_WEB_PACK = false;

const appRootDir = NO_WEB_PACK ? 'public' : 'dist';
const index = (NO_WEB_PACK ? 'index-no-webpack' : 'index') + '.html';

const page404 = fs.readFileSync('./'+ appRootDir + '/404.html');
const CORS = '*';

const appPages = [
  '/',
  '/profile',
  '/categories',
  '/profile/settings',
  '/editor',
  '/login',
  '/register',
  '/search',
];

const appPagesPatterned = [
  // \w0-9_\-%&=\?\+ некоторые (не все) символы из спеков URL
  /^\/user\/([\w0-9_\-%&=\?\+]+)$/,
  /^\/article\/([\w0-9_\-%&=\?\+]+)$/,
  /^\/categories\/([\w0-9_\-%&=\?\+]+)$/,
  /^\/search([\w0-9_\-%&=\?\+]+)$/,
];

const subDomains = [
  '/user/',
  '/article/',
  '/profile/',
  '/categories/',
];

// ///////////////////////////////// //
//
//          Server
//
// ///////////////////////////////// //

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', CORS);
    res.end();
    return;
  }

  // забираем урл загружаемого документа из GET запроса
  let path = req.url;
  console.log('request', path);
  if (appPages.indexOf(path) !== -1) {
    path = index;
  }

  // не найдено в путях приложения, проверить
  // в шаблонных путях (для url параметров)
  appPagesPatterned.forEach((pattern) => {
    if (path === 'index.html') {
      return;
    }
    if (pattern.test(path)) {
      path = index;
    }
  });

  // вырезаем начальную часть шаблонного пути
  for (const domain in subDomains) {
    if (path.startsWith(subDomains[domain])) {
      path = path.slice(subDomains[domain].length);
      break;
    }
  }

  if (path === 'index.html') {
    path = index;
  }

  // обработка апи. Если урл есть в массиве APIUrls, то это апи
  fs.readFile(`./${appRootDir}/${path}`, (err, data) => {
    if (err) {
      // вот тут отдать страничку 404
      data = page404;
    }

    console.log(
        'given: ',
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
});

console.log(`listening on http://${ip}:${port}`);
server.listen(port, ip);
