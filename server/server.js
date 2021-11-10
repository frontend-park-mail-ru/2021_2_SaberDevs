const http = require('http'); // для работы с http
const fs = require('fs'); // для работы с файловой системой
const mime = require('mime/lite');

// ///////////////////////////////// //
//
//            Globals
//
// ///////////////////////////////// //


const port = 8080;

// Поменять тут, в public/modules/ajax.js, server/server-api.js (не забыть CORS)
// тачка Дмитрия Дорофеева
// const ip = '192.168.0.31';
// локальная разработка
const ip = 'localhost';

const page404 = fs.readFileSync('./public/404.html');
const CORS = '*';

const appPages = [
  '/',
  '/profile',
  '/categories',
  '/profile/settings',
  '/editor',
  '/login',
];

const appPagesPatterned = [
  /^\/user\/(\w+)$/,
  /^\/article\/(\w+)$/,
];

const subDomains = [
  '/user/',
  '/article/',
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
    path = 'index.html';
  }

  // не найдено в путях приложения, проверить
  // в шаблонных путях (для url параметров)
  appPagesPatterned.forEach((pattern) => {
    if (path === 'index.html') {
      return;
    }
    if (pattern.test(path)) {
      path = 'index.html';
    }
  });

  // вырезаем начальную часть шаблонного пути
  for (const domain in subDomains) {
    if (path.startsWith(subDomains[domain])) {
      path = path.slice(subDomains[domain].length);
      break;
    }
  }

  // обработка апи. Если урл есть в массиве APIUrls, то это апи
  fs.readFile(`./public/${path}`, (err, data) => {
    if (err) {
      // вот тут отдать страничку 404
      data = page404;
    }

    console.log(
        'requested: ',
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
