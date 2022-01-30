# 2021_2_SaberDevs
Проект: [vc.ru](https://vc.ru)

[Репозиторий бекенда](https://github.com/go-park-mail-ru/2021_2_SaberDevs)

## Деплой
[SaberNews](https://sabernews.ru)

## Команда SaberDevs
### Front-end
- [Турчин Денис](https://github.com/Denactive)
- [Очеретная Светлана](https://github.com/Svetlanlka)
### Back-end
- [Любский Юрий](https://github.com/yurij-lyubskij)
- [Аристов Алексей](https://github.com/MollenAR)

## Менторы
- [Антон Елагин](https://github.com/AntonElagin)
- [Екатерина Придиус](https://github.com/pringleskate)

## Запуск
**Обратить внимание на начало файла public/modules/ajax.js, public/modules/webSocket.js**
  1. npm i
  2. switch(желаемый режим):
  ### локальный режим с mock-сервером
  npm run start
  ### запуск только статического сервера с console log'ами. Использовать API настоящего сервера
  npm run debug
  ### то же с сервис-воркером
  npm run debug-sw
  ### Предрелизная сборка с линтером. Выполнять перед заливкой в репозиторий
  npm run build
  ### Запуск на сервере с NGINX
  npm run prod
  ### Запуск на сервере с NGINX с console log'ами
  npm run debug-prod
  ### если по какой-то причине не нужен WebPack
  npm run debug-no-webpack

## Структура проекта
- public: все файлы, доступные клиенту
- dev: работа с шаблонами + скрипт интерпретации шаблонов в .js
  Скрипт сохраняет скомпилированные шаблоны в public/components по исходными названием
  ./dev/compile.js или npm run build для запуска. Запускать из корня проекта
- server: сервер статики
  ./server/server.js или npm run build-static для запуска
- server-api: сервер-заглушка для тестов
  ./server/server-api.js или npm run build для запуска вместе со статическим

## API
- сервер всегда возвращает структуры вида:
    response: {
        msg: string?,      // текстовые сообщения/пояснения от сервера. Позволяет не нарушать http-rest Content-Type: application/json
        data: object?,     // произвольный объект, который пробрасывается в пропсы компонента по окончанию выполнения запроса
        status: number,    // дубль HTTP status
    }
API (касается только поля data) описано в swagger[v*].yaml в корне проекта и JSDoc. Просмотреть удобно [здесь](https://editor.swagger.io)
- URL'ы web-приложения API описаны в server/server.js/APIUrls. По ним можно получить наш index.html


