import Ajax from './ajax';

import store from '../flux/store';
import authorizationActions from '../flux/actions/authorizationActions';
import apiActions from '../flux/actions/apiActions';
import {ajaxDebug} from '../globals';

const RETRY_DELAY = 30000;
/**
 * Выполняет logout-запрос на сервер. При успешном выполнении вызывает
 * событие AuthorizationTypes.LOGOUT
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
 * событие AuthorizationTypes.LOGIN
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
