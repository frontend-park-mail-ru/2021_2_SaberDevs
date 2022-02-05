import store from '../flux/store';
import {AuthorizationTypes} from '../flux/types';
import Ajax from '../modules/ajax';

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
    store.subscribe(AuthorizationTypes.LOGIN, () => pushSubsribe());
    activated = true;
  }
}

/**
 * проверяет подписку и предлагает создать, если нет
 */
function pushSubsribe() {
  console.log('[PushManager] Login reaction');
  navigator.serviceWorker.ready
      .then((reg: ServiceWorkerRegistration) => {
        reg.pushManager.getSubscription();
      })
      .then((sub: unknown) => new Promise((resolve) => {
        // проверяем был ли уже зарегистрирован объект pushService
        if (sub === undefined) {
          // спрашиваем юзера
          navigator.serviceWorker.ready.then(
              (reg) => reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(privateKey),
              }))
              .then((sub) => resolve(sub));
        } else {
          resolve(sub);
        }
      }))
      // в любом случае получаем подписку
      .then((sub: PushSubscription) => {
        const body = <object>sub.toJSON();
        Ajax.post({url: '/notifications/subscribe', body}).then(
            ({response}) => {
              console.warn('[PushManager] subsription on server:', response);
            },
        );
      })
      .then((sub) => console.log('[PushManager]', {subscription: sub}))
      .catch((err: Error) => console.error('[PushManager]', err));
}

/**
 * @param {string} base64String
 * @return {Uint8Array}
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
