import modalComponent from './modal.pug.js';

import store from '../../flux/store.js';
import {modalTypes} from '../../flux/types.js';
import {modalActions} from '../../flux/actions.js';

const animationTime = 200;
const informationWindowOpenTime = 2000;

let inClosing = false;
let isDestroyed = false;
let okBtnDispay = true;
let cancelBtnDispay = true;
let docTitle = '';

/**
 * @param {object} props
 * @property {string} title
 * @property {string} content
 * @property {string?} btnOkSign      - надпись на кнопке подтверждения
 * @property {string?} btnCancelSign  - надпись на кнопке отмены
 * @property {bolean} isEnteractive   - true - кнопки на футере отображаются
 * @property {bolean} isCancelable    - true - кнопка отмены
 *                                      на футере отображается
 * @property {callback} onConfirm     - обработчик кнопки ОК
 * @property {callback} onDecline     - обработчик кнопки CANCEL
 * @return {string}
 */
function fillDefaultModal(props) {
  if (modalsDebug) {
    console.log('modal filling: ' + JSON.stringify(props));
  }
  const okBtn = document.createElement('button');
  okBtn.type = 'button';
  okBtn.className = 'modal__btn';
  okBtn.id='modal__btn-ok';
  okBtn.innerHTML = props.btnOkSign || 'Понятно';
  okBtn.dataset.modalClose = 'true';
  okBtn.onclick = props.onConfirm || (() => {
    console.log('Modal: confirm');
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'modal__btn';
  cancelBtn.id='modal__btn-cancel';
  cancelBtn.innerHTML = props.btnCancelSign || 'Отмена';
  cancelBtn.dataset.modalClose = 'true';
  cancelBtn.onclick = props.onDecline || (() => {
    console.log('Modal: decline');
  });

  const footerButtons = props.isEnteractive ? (
    (
      okBtn.outerHTML +'\n' +
      (!props.isCancelable ? '' : cancelBtn.outerHTML)
    )
  ) : '';

  const modal = modalComponent({
    content: props.content || '',
    footer_butttons: footerButtons,
  });

  return modal;
}

/**
 * @param {object} props
 * @property {string} title
 * @property {string} content
 * @property {string?} btnOkSign      - надпись на кнопке подтверждения
 * @property {string?} btnCancelSign  - надпись на кнопке отмены
 * @property {bolean} isEnteractive   - true - кнопки на футере отображаются
 * @property {bolean} isCancelable    - true - кнопка отмены
 *                                      на футере отображается
 * @property {callback} onConfirm     - обработчик кнопки ОК
 * @property {callback} onDecline     - обработчик кнопки CANCEL
 * @return {HTMLDivElement}
 */
function _createModal(props) {
  const modalDiv = document.getElementById('modalroot');
  modalDiv.innerHTML = fillDefaultModal(props);

  store.subscribe(modalTypes.MODAL_CLOSE, () => {
    document.title = store.getState().page.docTitle;
  });

  store.subscribe(modalTypes.MODAL_OPEN, () => {
    document.title = docTitle;
  });

  return modalDiv;
}

const modalDiv = _createModal({
  isEnteractive: true,
  isCancelable: true,
});

const Modal = {
  animationTime,

  setDocTitle(title) {
    docTitle = title;
  },

  close() {
    if (isDestroyed) {
      if (modalsDebug) {
        console.warn('modal has been destroyed');
      }
      return;
    }

    store.dispatch(modalActions.modalClose());

    inClosing = true;
    const modalOverlay = document.getElementsByClassName('modal__overlay')[0];
    modalOverlay.classList.add('modal_close');
    modalOverlay.classList.remove('modal_open');
    // modalOverlay.style.display = 'none';
    // modalOverlay.style.opacity = 0;

    // const modalWindow = document.getElementsByClassName('modal__window')[0];
    // modalWindow.classList.add('modal_close');
    // modalWindow.classList.remove('modal_open');
    // Создаем класс, на элементы которого действует анимация.
    // Удаляем через заданное время, чтобы анимация прекратилась
    // modalDiv.classList.add('modal-fading-animation');
    setTimeout(() => {
      // modalDiv.classList.remove('modal-fading-animation');
      inClosing = false;
    }, animationTime);
  },

  open(isEnteractive = true) {
    if (isDestroyed) {
      if (modalsDebug) {
        console.warn('modal has been destroyed');
      }
      return;
    }

    store.dispatch(modalActions.modalOpen());
    // во время анимации закрытия не сетим анимацию закрытия
    if (inClosing) {
      console.warn('modal is in closing process');
      return;
    }

    const okBtn = document.getElementById('modal__btn-ok');
    const cancelBtn = document.getElementById('modal__btn-cancel');

    if (!isEnteractive) {
      okBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
    }

    const modalOverlay = document.getElementsByClassName('modal__overlay')[0];
    modalOverlay.classList.remove('modal_close');
    modalOverlay.classList.add('modal_open');
    // modalOverlay.style.display = 'block';
    // modalOverlay.style.opacity = 1;

    // const modalWindow = document.getElementsByClassName('modal__window')[0];
    // console.log('MODAL WINDOW: ', modalWindow);
    // modalWindow.classList.remove('modal_close');
    // modalWindow.classList.add('modal_open');

    // TODO: временное выплывающее окно
    if (!isEnteractive) {
      setTimeout(() => {
        this.close();
        if (okBtnDispay) {
          okBtn.style.display = 'block';
        }
        if (cancelBtnDispay) {
          cancelBtn.style.display = 'block';
        }
      }, informationWindowOpenTime);
    }
  },

  setContent(content) {
    if (modalsDebug) {
      console.log('Modal: setContent to ', content);
    }
    const contentDiv = modalDiv.querySelector('.modal__content');
    if (typeof content === 'string') {
      contentDiv.innerHTML = content;
    }
    if (content instanceof HTMLElement) {
      // const newContentDiv = document.createElement('div');
      // newContentDiv.className = 'modal__content';
      // newContentDiv.appendChild(content);
      // Object.assign(contentDiv, newContentDiv);
      // contentDiv.innerHTML = content.outerHTML;
      contentDiv.innerHTML = '';
      contentDiv.appendChild(content);
    }
  },

  setTitle(title) {
    if (modalsDebug) {
      console.log('Modal: setTitle to ', title);
    }
    let titleDiv = modalDiv.querySelector('.modal__header');
    if (typeof title === 'string') {
      titleDiv.innerHTML = title;
    }
    if (title instanceof HTMLElement) {
      const newTitleDiv = document.createElement('div');
      titleDiv.className = 'modal__header';
      newTitleDiv.appendChild(title);
      titleDiv = newTitleDiv;
    }
  },

  // при работе с этой функцией сбиваются анимации !
  configurate(props) {
    modalDiv.innerHTML = fillDefaultModal(props);
  },

  enableOkBtn() {
    const okBtn = document.getElementById('modal__btn-ok');
    okBtn.style.display = 'block';
    okBtnDispay = true;
  },

  disableOkBtn() {
    const okBtn = document.getElementById('modal__btn-ok');
    okBtn.style.display = 'none';
    okBtnDispay = false;
  },

  enableCancelBtn() {
    const cancelBtn = document.getElementById('modal__btn-cancel');
    cancelBtn.style.display = 'block';
    cancelBtnDispay = true;
  },

  disableCancelBtn() {
    const cancelBtn = document.getElementById('modal__btn-cancel');
    cancelBtn.style.display = 'none';
    cancelBtnDispay = false;
  },

  changeBtnOkSign(text) {
    const okBtn = document.getElementById('modal__btn-ok');
    okBtn.innerText = text;
  },

  changeBtnCancelSign(text) {
    const cancelBtn = document.getElementById('modal__btn-cancel');
    cancelBtn.innerText = text;
  },
};

/**
 * Обработчик элементов закрытия окна
 * @param {event} e;
 */
function modalCloseListener(e) {
  const target = e.target;
  if (target.dataset['modalClose']) {
    Modal.close();
  }
}

modalDiv.addEventListener('click', modalCloseListener);

Object.assign(Modal, {
  // removes event listeners
  destroy() {
    this.close();
    modalDiv.removeEventListener('click', modalCloseListener);
    modalDiv.innerHTML = '';
    isDestroyed = true;
  },
});

export default Modal;
