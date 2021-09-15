const http = require('http');  // для работы с http
const fs = require('fs');  // для работы с файловой системой
const mime = require('mime/lite');  
const debug = require('debug');

const log = debug('*')

const page404 = fs.readFileSync('./public/404.html')  // мы знаем, что код тут не упадет, т.к. страница существует
const CORS = '*'

const server = http.createServer((req, res) => {
    // забираем урл загружаемого документа из GET запроса
    const path = req.url === '/' ? 'index.html' : req.url;

    // работа с файловой системой
    // если файла нет - будет исключение. Сервер упадет. Надо ловить try/catch'ем либо заменить на асинхронную версию
    // const file = fs.readFileSync(`./public/${path}`)
    // замена на
    const file = fs.readFile(`./public/${path}`, (err, data) => {
        if (err) {
            // вот тут отдать страничку 404
            data = page404;
            // res.writeHead(404);
        } else {
            // res.writeHead(200);
        }

        console.log("requested: ", path, "| ext: ", path.slice(path.lastIndexOf('.') + 1), " mime: ",  mime.getType(path.slice(path.lastIndexOf('.') + 1)))

        res.setHeader("Content-Type", mime.getType(path.slice(path.lastIndexOf('.') + 1)));
        // CORS
        res.setHeader("Access-Control-Allow-Origin", CORS);

        res.write(data);
        res.end();
    });
});

const port = 8000;
console.log("listening on http://127.0.0.1:" + port);
server.listen(port);