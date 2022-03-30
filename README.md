# 2021_2_SaberDevs
Команда: **SaberDevs**

Проект: **vc.ru**

**[Деплой](https://sabernews.ru)**

**[Репозиторий бекенда]**(https://github.com/go-park-mail-ru/2021_2_SaberDevs)

## О проекте
Новостной сайт. 

Пользователи сами фильтруют контент с помощью системы рейтингов. Под каждой новостью можно поделиться мнением о статье в секции комментариев.

- [Презентация и макет](https://drive.google.com/drive/folders/13MDMsLdPp8RBGdvUscu2sP_XIzrElihA?usp=sharing)

## Команда
- [Турчин Денис](https://github.com/Denactive)
- [Любский Юрий](https://github.com/yurij-lyubskij)
- [Очеретная Светлана](https://github.com/Svetlanlka)
- [Аристов Алексей](https://github.com/MollenAR)

## Менторы
- [Антон Елагин](https://github.com/AntonElagin)
- [Екатерина Придиус](https://github.com/pringleskate)
 
## Технологии
- **Native JS**
- NodeJS
- Pug
- Webpack
- SCSS
- ESLint, StyleLint
- Swagger OpenAPI3

## Архитектура и особенности
- **MVVM**
- Flux unidirectional data flow
- Promise AJAX, WS
- HistoryAPI router
- PushAPI
- Link sharing: e-mail, TG, VK, OK

## Структура проекта
- public: все файлы, доступные клиенту
- dev: работа с шаблонами + скрипт интерпретации шаблонов в .js
  Скрипт сохраняет скомпилированные шаблоны в public/components по исходными названием
  ./dev/compile.js или npm run build для запуска. Запускать из корня проекта
- server: development-сервер статики
  ./server/server.js или npm run build-static для запуска
- server-api: development-сервер для тестов
  ./server/server-api.js или npm run build для запуска вместе со статическим

## API
- сервер всегда возвращает структуры вида (описаны в JSDoc):
  ```
    response: {
        msg: string?,      // текстовые сообщения/пояснения от сервера. Позволяет не нарушать http-rest Content-Type: application/json
        data: object?,     // произвольный объект, который пробрасывается в пропсы компонента по окончанию выполнения запроса
        status: number,    // дубль HTTP status
    }
  ```
- URL'ы web-приложения API описаны в server/server.js/APIUrls. По ним сервер отдает index.html
- API (касается только поля data) описано в swagger[v*].yaml в корне проекта. Открыть можно [здесь](https://editor.swagger.io)

## Deploy
- Сервис развернут в датацентре доступен по адресу **[sabernews.ru](https://sabernews.ru)**.
- Для подключения открыты порты 80, 443, 22. Соответсвенно, протоколы подключения - **HTTP / HTTPS / WS / HTTP2 / SSH**.
- Статика - Nginx.
- API - [свой сервер]((https://github.com/go-park-mail-ru/2021_2_SaberDevs)) на golang. Настроен сбор метрик с использованием Grafana и Prometheus.
