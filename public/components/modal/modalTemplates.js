import Modal from './modal.js';
import SignupModal from './signupModal.js';

/**
 * Информационное окно
 * @param {string} header
 * @param {string | HTMLElement} content
 */
export function showModalInformative(header = '', content = '') {
  Modal.setTitle(header);
  Modal.setContent(content);
  Modal.open(false);
}

/**
 * Информационное окно об HTTP ошибках 400 и 500
 * @param {number} status
 * @param {string} msg
 */
export function showModalNetOrServerError(status, msg) {
  if ((status / 100 + '')[0] === '5') {
    Modal.setTitle(`Сервис временно не доступен: ${status}`);
  }
  if ((status / 100 + '')[0] === '4') {
    Modal.setTitle(/* пользовательская */`Ошибка ${status}`);
  }
  Modal.setContent(msg);
  Modal.open(false);
}

/**
 * Информационное окно, требующее подтверждения
 * @param {string} header
 * @param {string | HTMLElement} content
 * @param {function} onConfirm
 */
export function showModalWarn(header, content, onConfirm = () => {}) {
  Modal.setTitle(header);
  Modal.setContent(content);
  Modal.enableOkBtn();
  Modal.changeBtnOkSign('Понятно');
  Modal.setOkBtnAction(onConfirm);
  Modal.disableCancelBtn();
  Modal.open(true);
}

/**
 * Информационное окно, требующее подтверждения
 * @param {string} header
 * @param {string | HTMLElement} content
 * @param {function} onConfirm
 */
export function modalTest(header, content, onConfirm = () => {}) {
  Modal.setTitle(header);
  Modal.setContent(content);
  Modal.enableOkBtn();
  Modal.changeBtnOkSign('Понятно');
  Modal.setOkBtnAction(onConfirm);
  Modal.disableCancelBtn();
  Modal.open(true);
}

/**
 * Информационное окно, требующее подтверждения
 * @param {string} header
 * @param {string | HTMLElement} content
 * @param {function} onConfirm
 * @param {function} onDecline
 */
export function showModalConfirm(
    header, content, onConfirm, onDecline = () => {},
) {
  Modal.setTitle(header);
  Modal.setContent(content);
  Modal.changeBtnOkSign('Да');
  Modal.enableOkBtn();
  Modal.setOkBtnAction(onConfirm);
  Modal.changeBtnCancelSign('Отмена');
  Modal.enableCancelBtn();
  Modal.setCancelBtnAction(onDecline);
  Modal.open(true);
}

/**
 * Сборник полезных модальных окон
 * Все функции включают полную настройку модального окна
 * @class ModalTemplates
 */
export default class ModalTemplates {
  /**
 * Страница содержит главный компонент - форму регистрации
 * @param {boolean} showRegister
 * true, если нужно отобразить форму
 * для регистрации, false - для входа
 */
  static signup(showRegister) {
    SignupModal.show(showRegister);
  }

  /**
 * Информационное окно об HTTP ошибках 400 и 500
 * @param {number} status
 * @param {string} msg
 */
  static netOrServerError(status, msg) {
    showModalNetOrServerError(status, msg);
  }

  /**
   * Информационное окно
   * @param {string} header
   * @param {string | HTMLElement} content
   */
  static informativeMsg(header = '', content = '') {
    showModalInformative(header, content);
  }

  /**
   * Информационное окно, требующее подтверждения
   * @param {string} header
   * @param {string | HTMLElement} content
   * @param {function} onConfirm
   * @param {function} onDecline
   */
  static confirm(header, content, onConfirm, onDecline) {
    showModalConfirm(header, content, onConfirm, onDecline);
  }

  /**
   * Информационное окно, требующее подтверждения
   * @param {string} header
   * @param {string | HTMLElement} content
   * @param {function} onConfirm
   */
  static warn(header, content, onConfirm) {
    showModalWarn(header, content, onConfirm);
  }
}
