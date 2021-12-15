import store from '../flux/store.js';
import {authorizationTypes} from '../flux/types.js';

// eslint-disable-next-line max-len
const privateKey = 'BAm53SFQL61CJdkPZYxN4qcdNTpnRc5yVSrL182-GNHW1RYmgRSeHoF5rYdMUfZMGT93MzVsN64NBe0azXKcplM';

let activated = false;

/**
 * @class
 */
export default class PushManager {
  /**
   * активировать проверку подписки при авторизации
   */
  static init() {
    if (activated) {
      return;
    }
    // store.subscribe(authorizationTypes.LOGIN, () => pushSubsribe());
    pushSubsribe();
    activated = true;
  }
}

/**
 * проверяет подпиську и предлагает создать, если нет
 */
function pushSubsribe() {
  navigator.serviceWorker.ready
      .then((reg) => {
        reg.pushManager.getSubscription();
      })
      .then((sub) => {
        // проверяем был ли уже зарегистрирован объект pushService
        if (sub === undefined) {
          // спрашиваем юзера
          navigator.serviceWorker.ready.then(
              (reg) => reg.pushManager.subscribe({
                userVisibleOnly: true,
                // applicationServerKey: urlBase64ToUint8Array(pk),
                applicationServerKey: urlBase64ToUint8Array(privateKey),
              }));
        } else {
          // шлем на сервер актуалку
          console.warn('[PushManager] Типа пошли на сервер');
          return sub;
        }
      })
      .then((sub) => console.log('[PushManager]', {subscription: sub}))
      .catch((err) => console.error('[PushManager]', err));
}

/**
 * @param {string} base64String
 * @return {Uint8Array}
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
