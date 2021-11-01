import Ajax from './ajax.js';

import store from '../flux/store.js';
import {authorizationActions} from '../flux/actions.js';
import {apiActions} from '../flux/actions.js';

const RETRY_DELAY = 30000;
/**
 * Выполняет logout-запрос на сервер. При успешном выполнении вызывает
 * событие authorizationTypes.LOGOUT
 */
export function logoutRequest() {
  Ajax.post({
    url: '/user/logout',
    body: {},
  })
      .then(() => store.dispatch(authorizationActions.logout()));
}

/**
 * Попытка аутентификации пользователя
 * через куки, например, при загрузке приложения
 * При успешном выполнении вызывает
 * событие authorizationTypes.LOGIN
 * @return {Promise}
 */
export function cookieLogin() {
  return Ajax.post({
    url: '/',
    body: {},
  })
      .then(
          ({status, response}) => {
            if (status === Ajax.STATUS.ok) {
              store.dispatch(authorizationActions.login(response.data));
            }
            store.dispatch(apiActions.setAvailable());
          })
      .catch((error) => {
        if (ajaxDebug) {
          console.warn('[AJAX]', error.message);
        }
        store.dispatch(apiActions.setUnavailable());
        store.dispatch((dispatch, getState) => {
          setTimeout(cookieLogin, RETRY_DELAY);
        });
      });
}

const ajaxRequests = {
  cookieLogin,
  logoutRequest,
};

export default ajaxRequests;
