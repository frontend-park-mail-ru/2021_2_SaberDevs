import Ajax from './ajax.js';

import store from '../flux/store.js';
import {authorizationActions} from '../flux/actions.js';

/**
 * Выполняет logout-запрос на сервер. При успешном выполнении вызывает
 * событие authorizationTypes.LOGOUT
 */
export function logoutRequest() {
  Ajax.post({
    url: '/logout',
    body: {},
    callback: () => store.dispatch(authorizationActions.logout()),
  });
}

/**
 * Попытка аутентификации пользователя
 * через куки, например, при загрузке приложения
 * При успешном выполнении вызывает
 * событие authorizationTypes.LOGIN
 */
 export function cookieLogin() {
  Ajax.post({
    url: '/login',
    body: {},
    callback: (status, response) => {
      if (status === Ajax.STATUS.ok) {
        store.dispatch(authorizationActions.login(response.data));
      } else {
        console.log('Cookie-Login failed');
      }
    },
  });
}

const ajaxRequests = {
  cookieLogin,
  logoutRequest,
};

export default ajaxRequests;