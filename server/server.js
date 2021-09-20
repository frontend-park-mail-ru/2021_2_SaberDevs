const http = require('http');  // для работы с http
const fs = require('fs');  // для работы с файловой системой
const mime = require('mime/lite');  
const debug = require('debug');

/////////////////////////////////////
//
//          Globals
//
/////////////////////////////////////

const log = debug('*');

const page404 = fs.readFileSync('./public/404.html');  // мы знаем, что код тут не упадет, т.к. страница существует
const CORS = '*';
const REQUEST_LEN_LIMIT = 1e6;
const APIUrls = ["/login", "/signup"];

// type: UserData
const users = {
    'denistest': {
        login: 'DenisTest',
        name: 'Денис',
        surname: 'Турчин',
        email: 'd.turchin@mail.ru',
        password: 'DenisTest1',
        score: 3,
    },
};

/////////////////////////////////////
//
//          utils
//
/////////////////////////////////////

function sendUserdata(login) {
    userData = Object.assign({login}, users[login]);
    delete userData.password;
    return userData;
}

function fullfillError(res, msg) {
    console.log("\t\tresponse: 400 - " + msg);
    res.writeHead(400);
    const res_obj = {
        msg,
        data: null,
    } 
    res.write(JSON.stringify(res_obj));
    res.end();
}

function fullfillIncorrectLogin(res) {
    fullfillError(res, 'Логин или пароль неверные')
}

function fullfillLoginIsAlreadyTaken(res) {
    fullfillError(res, 'Этот логин уже занят')
}

function fullfillOKResponse(res, msg, data) {
    console.log("\t\tresponse: 200 - " + msg);
    res.writeHead(200);
    const res_obj = {
        msg,
        data
    } 
    res.write(JSON.stringify(res_obj));
    res.end();
}

function executeAPICall(req, res) {
    if (req.method == 'POST') {
        let body = '';

        // собираем все части сообщения, пока не получим все данные
        req.on('data', (data) => {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > REQUEST_LEN_LIMIT) {
                request.connection.destroy();
                console.log("\t\tError: 1 Mb excided");
            }
        });

        req.on('end', () => {
            res.setHeader("Content-Type", "application/JSON");
            res.setHeader("Access-Control-Allow-Origin", CORS);
            
            // returns object
            const req_body = JSON.parse(body);
            console.log("\t\trequest body: ", req_body);

            if (req.url === '/login') {
                if (users[req_body.login.toLowerCase()] !== undefined) {
                    console.log("\t\tUser has been found in db");

                    if (users[req_body.login].password === req_body.password) {
                        // TODO: setcookie
                        // 3-й параметр: высылаем данные из БД на клиент
                        // пароль на фронт не отправляем, лол))
                        fullfillOKResponse(res, 'Welcome back, ' + req_body.login, sendUserdata(req_body.login));
                    } else {
                        fullfillIncorrectLogin(res);
                    }
                } else {
                    fullfillIncorrectLogin(res);
                }
            }
            if (req.url === '/signup') {
                // пользователь уже существует
                if (users[req_body.login.toLowerCase()] !== undefined) {
                    fullfillLoginIsAlreadyTaken(res);
                } else {
                    // проверяем наличие все полей
                    if (!("login" in req_body && "password" in req_body && "email" in req_body)) {
                        fullfillError(res, 'Не достаточно данных');
                    } else {
                        // пишем в базу
                        users[req_body.login] = {
                            password: req_body.password,
                            email: req_body.email,
                            score: 0
                        }
                        // отвечаем, что регистрация успешна
                        // TODO: server-side validation
                        // TODO: setcookie
                        // пароль на фронт не отправляем, лол))
                        fullfillOKResponse(res, 'Success! Welcome, ' + req_body.login, sendUserdata(req_body.login));
                    }
                }
            }
        });
    } else {
        fullfillError(res, 'GET API пока не поддерживается :3')
    }
}

function isEmptyObject(obj) {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

function parseCookies (request) {
    const list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach( (cookie) => {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    if (!isEmptyObject(list)) {
        console.log("\t\tcookie found: ", JSON.stringify(list));
    }

    return list;
}


/////////////////////////////////////
//
//          Server
//
/////////////////////////////////////

const server = http.createServer((req, res) => {
    console.log("\turl: " + req.url);

    // забираем урл загружаемого документа из GET запроса
    const path = req.url === '/' ? 'index.html' : req.url;
    // const cookies = parseCookies(req);

    // обработка апи. Если урл есть в массиве APIUrls, то это апи
    if (APIUrls.indexOf(req.url) != -1) {
        console.log("\t\tAPI call: ", path, " | method: ", req.method);
        executeAPICall(req, res);
    } else {
        // работа с файловой системой
        // если файла нет - будет исключение. Сервер упадет. Надо ловить try/catch'ем либо заменить на асинхронную версию
        // const file = fs.readFileSync(`./public/${path}`)
        // замена на
        const file = fs.readFile(`./public/${path}`, (err, data) => {
            if (err) {
                // вот тут отдать страничку 404
                data = page404;
            }

            console.log("requested: ", path, "| ext: ", path.slice(path.lastIndexOf('.') + 1), " mime: ",  mime.getType(path.slice(path.lastIndexOf('.') + 1)))

            res.setHeader("Content-Type", mime.getType(path.slice(path.lastIndexOf('.') + 1)));
            // CORS
            res.setHeader("Access-Control-Allow-Origin", CORS);

            res.write(data);
            res.end();
        });
    }
});

const port = 8000;
console.log("listening on http://127.0.0.1:" + port);
server.listen(port);