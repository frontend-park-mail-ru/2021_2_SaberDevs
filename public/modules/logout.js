import Ajax from './ajax.js';

/**
 * Выполняется, если запрос прошел успешно
 * @callback requestCallback
 * @param {number} responseCode
 * @param {string} responseMessage
 */

/**
 * Выполняет logout-запрос на сервер. При успешном выполнении вызывает callback
 * @param {requestCallback} [callback = () => {}]
 */
export default function logoutRequest(callback) {
  Ajax.post({
    url: '/logout',
    body: {},
    callback,
  });
}
