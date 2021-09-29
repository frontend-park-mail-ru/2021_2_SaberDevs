// TODO: fetch API
// const APIurl = 'http://87.228.2.178:8081';
const APIurl = 'http://localhost:8080';

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
 * @param {Object} responseMessage
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
  const url = APIurl + (requestParams.url || '/');
  const fetchParams = {
    body: JSON.stringify(requestParams.body),
    mode: 'cors',
    method: requestParams.method,
  };

  if (ajaxDebug) {
    console.log('ajax request: ' + JSON.stringify(fetchParams));
  }

  let status = '';
  fetch(url, fetchParams)
      .then((response) => {
        status = response.status;
        return response.text();
      })
      .then((response) => {
        // console.log('ajax resolved ' + status+': '+JSON.stringify(response));
        console.log('ajax resolved ' + status +': ' + response);
        requestParams.callback(status, response);
      })
      .catch((error) => {
        console.warn(error);
        requestParams.callback(status, response);
        return;
      });
}

// Плагин для общения с API
const Ajax = {
  AJAX_METHODS: ajaxMethods,
  STATUS: ajaxStatuses,
  get: (requestParams) => ajax({method: ajaxMethods.get, ...requestParams}),
  post: (requestParams) => ajax({method: ajaxMethods.post, ...requestParams}),
};

export default Ajax;
