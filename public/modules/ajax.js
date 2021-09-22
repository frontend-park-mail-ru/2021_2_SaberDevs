// TODO: fetch API

/**
 * Поддерживаемые методы: GET и POST
 * @typedef {Object} AjaxMethod
 * @property {string} post
 * @property {string} get
 */
const ajaxMethods = {
  post: 'POST',
  get: 'GET',
};

/**
 * Поддерживаемые http-статусы ответа: 200, 400, 404
 * @typedef {Object} AjaxStatus
 * @property {number} ok
 * @property {number} notFound
 * @property {number} badRequest
 */
const ajaxStatuses = {
  ok: 200,
  notFound: 404,
  // redirect: 303,
  badRequest: 400,
};

/**
 * Выполняется, если запрос прошел успешно
 * @callback requestCallback
 * @param {number} responseCode
 * @param {string} responseMessage
 */

/**
 * Выполняет ajax-запрос на сервер. При успешном выполнении вызывает callback
 * @param {Object} requestParams
 * @property {AjaxMethod} [method = "GET"]
 * @property {Url} [url = '/']
 * @property {?Object} [body = null]
 * @property {requestCallback} [callback = () => {}]
 * @return {void}
 */
function ajax(requestParams) {
  const {
    method = ajaxMethods.get,
    url = '/',
    body = null,
    callback = () => {},
  } = requestParams;

  if (ajaxDebug) {
    console.log('ajax request: ' + JSON.stringify(requestParams));
  }

  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true); // true means async
  xhr.withCredentials = true; // true means CORS

  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) {
      return;
    }

    if (ajaxDebug) {
      console.log('ajax resolved: ' + xhr.status, ': ' + xhr.responseText);
    }

    callback(xhr.status, xhr.responseText);
  });

  if (body) {
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(body));
    return;
  }

  xhr.send();
}

const Ajax = {
  AJAX_METHODS: ajaxMethods,
  STATUS: ajaxStatuses,
  get: (requestParams) => ajax({method: ajaxMethods.get, ...requestParams}),
  post: (requestParams) => ajax({method: ajaxMethods.post, ...requestParams}),
};

export default Ajax;
