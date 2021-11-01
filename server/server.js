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

const appPages = ['/',
  // '/profile',
  // TODO: signup, login
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
    // res.setHeader('Access-Control-Allow-Credentials', true);
    res.end();
    return;
  }

  // забираем урл загружаемого документа из GET запроса
  let path = req.url;
  if (appPages.indexOf(path) !== -1) {
    path = 'index.html';
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
