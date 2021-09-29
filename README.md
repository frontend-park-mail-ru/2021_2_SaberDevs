# 2021_2_SaberDevs
Команда: SaberDevs

Проект: vc.ru

## Репозиторий бекенда
- [тут будет ссылочка]()

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
- server: сервер-заглушка для разработки
  ./server/server.js или npm run start для запуска

## API
- сервер всегда возвращает структуры (описаны в JSDoc):
    response: {
        msg: string,  // текстовые сообщения/пояснения от сервера. Позволяет не нарушать http-rest Content-Type: application/json
        data: obj     // произвольный объект, который пробрасывается в пропсы компонента по окончанию выполнения запроса
    }
- URL'ы API описаны в server/server.js/APIUrls. Предварительно: const APIUrls = ["/login", "/signup", "profile/<username>"];
- Пользователи представлены объектом UserData (описан в JSDoc). Пароль на клиент не возвращается
    предварительно: UserData: {
        login: string,
        name: string,
        surname: string,
        email: string,
        password: string,
        score: number,
    }
