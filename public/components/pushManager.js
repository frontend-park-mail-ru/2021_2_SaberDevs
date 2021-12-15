import store from '../flux/store.js';
import {authorizationTypes} from '../flux/types.js';
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
    store.subscribe(authorizationTypes.LOGIN, () => pushSubsribe());
    self.addEventListener('push', (e) => {
      console.warn('[PushManager]: push event');
      const title = e.data.title || 'SaberNews';
      e.waitUntil(
          self.registration.showNotification(title),
      );
    });
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
      .then((sub) => new Promise((resolve) => {
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
      .then((sub) => {
        const body = sub.toJSON();
        Ajax.post({url: 'api/v1/notifications/subscribe', body}).then(
            ({response}) => {
              console.warn('[PushManager] subsription on server:', response);
            },
        );
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
