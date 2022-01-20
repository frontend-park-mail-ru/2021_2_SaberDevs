# 2021_2_SaberDevs
Команда: SaberDevs

Проект: vc.ru
[Деплой](https://sabernews.ru)

[Репозиторий бекенда](https://github.com/go-park-mail-ru/2021_2_SaberDevs)


## Команда
- [Турчин Денис](https://github.com/Denactive)
- [Любский Юрий](https://github.com/yurij-lyubskij)
- [Очеретная Светлана](https://github.com/Svetlanlka)
- [Аристов Алексей](https://github.com/MollenAR)

## Менторы
- [Антон Елагин](https://github.com/AntonElagin)
- [Екатерина Придиус](https://github.com/pringleskate)

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
- сервер всегда возвращает структуры (описаны в JSDoc):
    response: {
        msg: string?,      // текстовые сообщения/пояснения от сервера. Позволяет не нарушать http-rest Content-Type: application/json
        data: object?,     // произвольный объект, который пробрасывается в пропсы компонента по окончанию выполнения запроса
        status: number,    // дубль HTTP status
    }
- URL'ы web-приложения API описаны в server/server.js/APIUrls. По ним можно получить наш index.html
- API (касается только поля data) описано в swagger[v*].yaml в корне проекта. Открыть можно [здесь](https://editor.swagger.io)
