import {ajaxDebug} from '../globals.js';

// ip: 89.208.197.247
// domain: sabernews

// Поменять тут, в server/server.js, server/server-api.js (не забыть CORS)
// Тачка Алексея
// const APIurl = 'http://87.228.2.178:8081/api/v1';
// Тачка Дорофеева
const APIurl = 'https://sabernews.ru:8081/api/v1';
// Локальная разработка
// const APIurl = 'http://localhost:8081/api/v1';
const CSRFCookieName = '_csrf';

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
  invalidSession: 424,
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
  const csrf = document.cookie.split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(CSRFCookieName + '='));
  const fetchParams = {
    body: JSON.stringify(requestParams.body),
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': csrf,
    },
    method: requestParams.method,
  };

  if (ajaxDebug) {
    console.log('ajax request', {url}, ': ' + JSON.stringify(fetchParams));
  }

  let status = 0;
  return fetch(url, fetchParams)
      .then((response) => {
        status = response.status;
        return response.json();
      })
      .then((response) => {
        if (ajaxDebug) {
          console.log('ajax resolved ' + status + ': ');
          console.log(response);
        }
        return {
          status,
          response,
        };
      })
      .catch((error) => {
        console.warn(error);
      });
}

/**
 * Выполняет отправку фото на сервер. При успешном выполнении вызывает callback
 * @param {Object} requestParams
 * @property {Url} [url = '/']
 * @property {any} body
 * @return {Promise}
 */
function postFile(requestParams) {
  const url = APIurl + (requestParams.url || '/');
  const formData = new FormData();
  formData.append('img', requestParams.body);
  const fetchParams = {
    body: formData,
    mode: 'cors',
    credentials: 'include',
    // https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
    method: ajaxMethods.post,
  };

  if (ajaxDebug) {
    console.log('ajax file post request', {url},
        ': ' + JSON.stringify(fetchParams));
  }

  let status = 0;
  return fetch(url, fetchParams)
      .then((response) => {
        status = response.status;
        return response.json();
      })
      .then((response) => {
        if (ajaxDebug) {
          console.log('ajax resolved ' + status + ': ');
          console.log(response);
        }
        return {
          status,
          response,
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
  postFile,
  APIurl,
};

export default Ajax;
