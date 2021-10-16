// const APIurl = 'http://87.228.2.178:8081';
const APIurl = 'http://localhost:8081/api/v1';

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
 * Выполняет ajax-запрос на сервер. При успешном выполнении вызывает callback
 * @param {Object} requestParams
 * @property {AjaxMethod} [method = "GET"]
 * @property {Url} [url = '/']
 * @property {any} body
 * @return {Promise}
 */
function ajax(requestParams) {
  const url = APIurl + (requestParams.url || '/');
  const fetchParams = {
    body: JSON.stringify(requestParams.body),
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: requestParams.method,
  };

  if (ajaxDebug) {
    console.log('ajax request: ' + JSON.stringify(fetchParams));
  }

  let status = 0;
  return fetch(url, fetchParams)
      .then((response) => {
        status = response.status;
        return response.text();
      })
      .then((response) => {
        if (ajaxDebug) {
          console.log('ajax resolved ' + status +': ' + response);
        }
        return {
          status,
          response: JSON.parse(response),
        };
      })
      .catch((error) => {
        console.warn(error);
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
