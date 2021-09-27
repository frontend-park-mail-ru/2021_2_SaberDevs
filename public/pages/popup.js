/**
 * импортирует root-элемент через замыкание
 *
 * Страница содержит главный компонент - форму регистрации
 * для нее обязательны следующие поля
 * @param {object} props
 * @property {string} title
 * @property {Object} content
 */
export default function raisePopup(props) {
  // * @return {HTMLDivElement}
  if (propsDebug) {
    console.log('Popup: ', props.title, '\n', props.content);
  }

  // v1

  // const popupOuterArea = document.createElement('div');
  // popupOuterArea.className = 'popup-outer-area';

  // const popupRoot = document.createElement('div');
  // popupRoot.className='popup';

  // const popupTitle= document.createElement('div');
  // popupTitle.className='popup-title';
  // popupTitle.textContent = props.title;

  // const popupContent = document.createElement('div');
  // popupContent.className='popup-content col';
  // popupContent.innerHTML = props.content;

  // popupRoot.appendChild(popupTitle);
  // popupRoot.appendChild(popupContent);
  // popupOuterArea.appendChild(popupRoot);

  // popupOuterArea.addEventListener('click', (e) => {
  //   e.preventDefault();
  //   console.log('popupOuter clicked');
  // });

  // popupRoot.addEventListener('click', (e) => {
  //   e.preventDefault();
  //   console.log('popupRoot clicked');
  // });

  // return popupOuterArea;
  const popupClose = document.createElement('a');
  popupClose.href='#x';
  popupClose.className='overlay';
  popupClose.id = 'popup-root';
  popupClose.textContent = 'x';


  const popupRoot = document.createElement('div');
  popupRoot.className='popup';

  const popupTitle= document.createElement('h2');
  popupTitle.textContent = props.title;

  const popupContent = document.createElement('div');
  popupContent.className='popup-content col';
  popupContent.innerHTML = props.content;

  popupRoot.appendChild(popupClose);
  popupRoot.appendChild(popupTitle);
  popupRoot.appendChild(popupContent);
  popupOuterArea.appendChild(popupRoot);
}

// static popup usage

// <a href="#popup-root" class="button button-green">Открыть окно</a>

/*
<a href="#x" class="overlay-static-popup" id="popup-root"></a>
<div class="static-popup">
  <h2>Заголовок</h2>
  Здесь вы можете разместить любое содержание, текст с картинками или видео!
  <a class="close-static-popup" title="Закрыть" href="#close"></a>
</div>
*/
