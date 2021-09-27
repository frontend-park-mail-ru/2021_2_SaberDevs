const fadingSpeed = 200;

/**
 * @param {object} options
 * @property {string} title
 * @property {Object} content
 * @return {Object}
 */
function createModal(options) {
  // const modalDiv = document.createElement('div');
  const modalDiv = document.getElementById('modalroot');
  modalDiv.innerHTML = `
  <div class="modal-overlay">
    <div id="modal" class="modal-window">
      <div class="modal-header">
        <span class="modal-title">Popup</span>
        <span class="modal-close-btn">&times</span>
      </div>
      <div class="modal-content">
        <h3>Popup</h3>
        <p>
          lorem ipsum dolor sit amet, consectetur adip Lorem ipsum
          dolor sit amet consectetur adipisicing elit.
          Consequatur nulla aliquam adipisci saepe quaerat recusandae 
          alias odit quam sequi dolor voluptates
          doloremque totam distinctio aut nisi quasi neque placeat pariatur
          tempora, quis officia corrupti illo porro?
          Ratione libero minus doloribus impedit pariatur ullam harum
          quae blanditiis?Perferendis et ullam quod.
        </p>
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-btn" id="modal-btn-ok">
          Понятно
        </button>
        <button type="button" class="modal-btn" id="modal-btn-cancel">
          Отмена
        </button>
      </div>
    </div>
  </div>
  `;
  // root.appendChild(modalDiv);
  return modalDiv;
}

const modalDiv = createModal();
let inClosing = false;

const modalComponent = {
  open() {
    // во время анимации закрытия не сетим анимацию закрытия
    if (inClosing) {
      return;
    }
    modalDiv.classList.add('modal-open');
  },
  close() {
    inClosing = true;
    modalDiv.classList.remove('modal-open');
    // Создаем класс, на элементы которого действует анимация.
    // Удаляем через заданное время, чтобы анимация прекратилась
    modalDiv.classList.add('modal-fading-animation');
    setTimeout(() => {
      modalDiv.classList.remove('modal-open');
      inClosing = false;
    }, fadingSpeed);
  },
  destroy() {},
};

export default modalComponent;
