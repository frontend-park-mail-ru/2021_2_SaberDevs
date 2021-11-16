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
let clearOkListener = () => {};
let clearCancelListener= () => {};

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
    console.log('[Modal] modal filling: ' + JSON.stringify(props));
  }
  const modal = modalComponent({
    title: props.title || '',
    content: props.content || '',
    ok_sign: props.btnOkSign || 'Понятно',
    cancel_sign: props.btnCancelSign || 'Отмена',
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

  const okBtn = modalDiv.querySelector('#modal__btn-ok');
  const activeOkEventListener = (e) => {
    e.preventDefault();
    if (typeof props.onConfirm === 'function') {
      props.onConfirm();
    } else {
      console.log('[Modal] confirm');
    }
  };

  okBtn.addEventListener('click', activeOkEventListener);
  clearOkListener = () => {
    okBtn.removeEventListener('click', activeOkEventListener);
  };

  const cancelBtn = modalDiv.querySelector('#modal__btn-cancel');
  const activeCancelEventListener = (e) => {
    e.preventDefault();
    if (typeof props.onDecline === 'function') {
      props.onDecline();
    } else {
      console.log('[Modal] decline');
    }
  };
  cancelBtn.addEventListener('click', activeCancelEventListener);
  clearCancelListener = () => {
    cancelBtn.removeEventListener('click', activeCancelEventListener);
  };

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
        console.warn('[Modal] close: modal has been destroyed');
      }
      return;
    }

    store.dispatch(modalActions.modalClose());

    inClosing = true;
    const modalOverlay = modalDiv.querySelector('.modal__overlay');
    modalOverlay.classList.add('modal_close');
    modalOverlay.classList.remove('modal_open');
    setTimeout(() => {
      inClosing = false;
    }, animationTime);
  },

  open(isEnteractive = true) {
    if (isDestroyed) {
      if (modalsDebug) {
        console.warn('[[Modal] open: modal has been destroyed');
      }
      return;
    }

    store.dispatch(modalActions.modalOpen());
    // во время анимации закрытия не сетим анимацию закрытия
    if (inClosing) {
      console.warn('[Modal] open: modal is in closing process');
      return;
    }

    const okBtn = modalDiv.querySelector('#modal__btn-ok');
    const cancelBtn = modalDiv.querySelector('#modal__btn-cancel');
    okBtn.className = 'modal__btn-ok';
    okBtn.classList.add('modal__btn');
    cancelBtn.className = 'modal__btn-cancel';
    cancelBtn.classList.add('modal__btn');

    if (!isEnteractive) {
      okBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
    }

    const modalOverlay = modalDiv.querySelector('.modal__overlay');
    modalOverlay.classList.remove('modal_close');
    modalOverlay.classList.add('modal_open');

    // временное выплывающее окно
    if (!isEnteractive) {
      setTimeout(() => {
        this.close();
        setTimeout(() => {
          if (okBtnDispay) {
            okBtn.style.display = 'block';
          }
          if (cancelBtnDispay) {
            cancelBtn.style.display = 'block';
          }
        }, animationTime);
      }, informationWindowOpenTime);
    }
  },

  getContent() {
    const contentDiv = modalDiv.querySelector('.modal__content');
    if (!contentDiv) {
      console.warn('[Modal] no .modal__content found');
    }
    return contentDiv;
  },

  setContent(content) {
    if (modalsDebug) {
      console.log('[Modal]: setContent to ', content);
    }
    const contentDiv = modalDiv.querySelector('.modal__content');
    if (typeof content === 'string') {
      contentDiv.innerHTML = content;
    }
    if (content instanceof HTMLElement) {
      contentDiv.innerHTML = '';
      contentDiv.appendChild(content);
    }
  },

  appendContent(content) {
    if (modalsDebug) {
      console.log('[Modal]: appendContent:', content);
    }
    const contentDiv = modalDiv.querySelector('.modal__content');
    if (typeof content === 'string') {
      contentDiv.innerHTML += content;
    }
    if (content instanceof HTMLElement) {
      contentDiv.appendChild(content);
    }
  },

  setTitle(title) {
    if (modalsDebug) {
      console.log('[Modal]: setTitle to ', title);
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
   */
  configurate(props) {
    modalDiv.innerHTML = fillDefaultModal(props);

    const okBtn = modalDiv.querySelector('#modal__btn-ok');
    const activeOkEventListener = (e) => {
      e.preventDefault();
      if (typeof props.onConfirm === 'function') {
        props.onConfirm();
      } else {
        console.log('[Modal] confirm');
      }
    };

    okBtn.addEventListener('click', activeOkEventListener);
    clearOkListener = () => {
      okBtn.removeEventListener('click', activeOkEventListener);
    };
    const cancelBtn = modalDiv.querySelector('#modal__btn-cancel');
    const activeCancelEventListener = (e) => {
      e.preventDefault();
      if (typeof props.onDecline === 'function') {
        props.onDecline();
      } else {
        console.log('[Modal] decline');
      }
    };
    cancelBtn.addEventListener('click', activeCancelEventListener);

    clearCancelListener = () => {
      console.log('[Modal] clear Cancel Listener', {activeCancelEventListener});
      cancelBtn.removeEventListener('click', activeCancelEventListener);
    };

    if (!props.isEnteractive) {
      okBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
    }
    if (!props.isCancelable) {
      cancelBtn.style.display = 'none';
    }
  },

  enableOkBtn() {
    const okBtn = modalDiv.querySelector('#modal__btn-ok');
    okBtn.style.display = 'block';
    okBtnDispay = true;
  },

  disableOkBtn() {
    const okBtn = modalDiv.querySelector('#modal__btn-ok');
    okBtn.style.display = 'none';
    okBtnDispay = false;
  },

  enableCancelBtn() {
    const cancelBtn = modalDiv.querySelector('#modal__btn-cancel');
    cancelBtn.style.display = 'block';
    cancelBtnDispay = true;
  },

  disableCancelBtn() {
    const cancelBtn = modalDiv.querySelector('#modal__btn-cancel');
    cancelBtn.style.display = 'none';
    cancelBtnDispay = false;
  },

  changeBtnOkSign(text) {
    const okBtn = modalDiv.querySelector('#modal__btn-ok');
    okBtn.innerText = text;
  },

  changeBtnCancelSign(text) {
    const cancelBtn = modalDiv.querySelector('#modal__btn-cancel');
    cancelBtn.innerText = text;
  },

  setOkBtnAction(onConfirm) {
    clearOkListener();
    const okBtn = modalDiv.querySelector('#modal__btn-ok');
    const activeOkEventListener = (e) => {
      e.preventDefault();
      if (typeof onConfirm === 'function') {
        onConfirm();
      } else {
        console.log('[Modal] confirm');
      }
    };

    okBtn.addEventListener('click', activeOkEventListener);
    clearOkListener = () => {
      okBtn.removeEventListener('click', activeOkEventListener);
    };
  },

  setCancelBtnAction(onDecline) {
    clearCancelListener();
    const cancelBtn = modalDiv.querySelector('#modal__btn-cancel');
    const activeCancelEventListener = (e) => {
      e.preventDefault();
      if (typeof onDecline === 'function') {
        onDecline();
      } else {
        console.log('[Modal] confirm');
      }
    };
    cancelBtn.addEventListener('click', activeCancelEventListener);

    clearCancelListener = () => {
      cancelBtn.removeEventListener('click', activeCancelEventListener);
    };
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
