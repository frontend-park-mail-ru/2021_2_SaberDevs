// ///////////////////////////////// //
//
//                utils
//
// ///////////////////////////////// //

/**
 * @param {string} str
 * @return {string}
 */
export function spanUnderline(str) {
  return '<span style="display: contents; text-decoration: underline;">' +
  str + '</span>';
}

/**
 * @param {string} str
 * @param {string} color
 * @return {string}
 */
export function spanColor(str, color) {
  return '<span style="display: contents; color: ' + color + ';">' +
  str + '</span>';
}
/**
 * @param {number} time
 * @return {string}
 */
export function getRusDateTime(time) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timezone: 'Russia/Moscow',
  };

  return new Date(time).toLocaleString('ru', options);
}

/**
 * @param {BlobURL} url
 * @return {Promise<Blob>}
 */
export function recoverBlobWithUrl(url) {
  return new Promise((resolve, reject) => {
    if (typeof url !== 'string') {
      reject(new Error('Передай мне строку, а не url: ' + url));
    }
    if (url === '') {
      reject(new Error('Картинку не отправляем'));
    } else {
      resolve();
    }
  })
      .then(() => fetch(url))
      .then((res) => res.blob());
}

/**
 * @param {string} file
 * @return {Promise}
 */
export function getFileBrowserStorageUrl(file) {
  return new Promise((r) => {
    const reader = new FileReader();
    reader.onload = (e) => r(e.target.result);
    reader.readAsDataURL(file);
  });
}

/**
 * Вызов Router.open(to) через имитацию клика
 * Обязательно наличие элемента #root в DOM
 * @param {string} to
 */
export function redirect(to) {
  const clickSimulator = document.createElement('a');
  const root = document.querySelector('#root');

  clickSimulator.id = 'clickSimulator';
  clickSimulator.href = to;

  root.appendChild(clickSimulator);
  clickSimulator.click();
  root.removeChild(clickSimulator);
}

/**
 * Вызов Router.open(to) через имитацию клика
 * Обязательно наличие элемента #root в DOM
 * @param {string} to
 */
export function redirectOuter(to) {
  const clickSimulator = document.createElement('a');
  const root = document.querySelector('#root');

  clickSimulator.id = 'clickSimulator';
  clickSimulator.href = to;
  clickSimulator.dataset.router = 'outer';

  root.appendChild(clickSimulator);
  clickSimulator.click();
  root.removeChild(clickSimulator);
}

/**
 * Возврат содежимого в виде строки
 * @param {HTMLElement} el
 * @return {string}
 */
export function htmlToString(el) {
  const wrapper = document.createElement('div');
  wrapper.appendChild(el);
  return wrapper.innerHTML;
}

/**
 * генерирует рандомный цвет
 * @param {number} size
 * @return {string}
 */
export function genRanHex(size = 6) {
  return [...Array(size)].map(
      () => Math.floor(Math.random() * 16).toString(16),
  ).join('');
}

/**
 * MurmurHash3 хеш-функция
 * @param {string} str
 * @return {number}
 */
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
    h = h << 13 | h >>> 19;
  }
  return h;
}

/**
 * псевдорандомный генератор
 * @param {number} seed
 */
function* pseudoRandom(seed) {
  let value = seed;

  while (true) {
    value = value * 16807 % 2147483647;
    yield value;
  }
};

/**
 * генерирует рандомный цвет
 * @param {string?} str
 * @return {string}
 */
export function genRanHexColor(str = null) {
  const generator = pseudoRandom(Math.abs(xmur3(str || '')));
  const hash = typeof str !== 'string' ?
    () => Math.floor(Math.random() * 255) :
    () => generator.next().value % 255;

  while (true) {
    let red = 0;
    let green = 0;
    let blue = 0;

    red = hash();
    green = hash();
    blue = hash();

    // https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
    // функция из PHP
    // цвет считается ярким, если яркость больше 155, тусклым, если < 40

    const brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
    // Самый светлый черный в проекте #313030.
    // пусть цвета тусклее #404040 (40h = 64) не пропускаются
    if (brightness < 155 && brightness > 40 &&
          (red > 64 && green > 40 && blue > 64)) {
      return '#' + red.toString(16) + green.toString(16) + blue.toString(16);
    }
  }
}

/**
 * Создает импут-поле в одну строку
 * @param {string} type
 * @param {string} placeholder
 * @param {string} name
 * @param {string} title
 * @param {boolean} [required = false]
 * @param {string} pattern
 * @return {HTMLInputElement}
 */
export function createInput(
    type,
    placeholder,
    name,
    title = null,
    required = false,
    pattern = null,
) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = 'input-' + name;
  input.placeholder = placeholder;
  input.required = required;
  if (title != null) input.title = title;
  if (pattern != null) input.pattern = pattern;

  return input;
}

/**
 * Создает красивую строку с импутом для формы
 * @param {HTMLInputElement} input
 * @return {HTMLDivElement}
 */
export function createInputRow(input) {
  const div = document.createElement('div');
  div.className = 'form-row';

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.title = input.title;
  const tooltipSign = document.createElement('div');
  tooltipSign.className = 'tooltip-sign';
  tooltipSign.textContent = '?';

  if (input.title === 'null') {
    tooltip.style.visibility = 'hidden';
  }

  div.appendChild(input);
  tooltip.appendChild(tooltipSign);
  div.appendChild(tooltip);

  return div;
}

/**
 * Создает html-label в одну строку
 * @param {string} htmlFor
 * @param {string} text
 * @return {HTMLLabelElement}
 */
export function createLabel(htmlFor, text) {
  const label = document.createElement('label');
  label.textContent = text;
  label.htmlFor = htmlFor;
  return label;
}

/**
 * Возвращает доступную для отображения высоту окна с учетом скрола
 * @return {number}
 */
export function getPageHeight() {
  return Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight,
  );
}

/**
 * Возвращает ширину окна браузера пользователя
 * @return {number}
 */
export function getUserWindowWidth() {
  return document.documentElement.clientWidth;
}

/**
 * Возвращает высоту окна браузера пользователя
 * @return {number}
 */
export function getUserWindowHeight() {
  return document.documentElement.clientHeight;
}

/**
 * Возвращает текущую позицию скрола
 * @return {number}
 */
export function getCurrentPageYPos() {
  return window.pageYOffset;
}

const Utils = {
  createInput,
  createLabel,
  createInputRow,
  getPageHeight,
  getUserWindowWidth,
  getUserWindowHeight,
  getCurrentPageYPos,
  redirect,
  htmlToString,
  genRanHexColor,
  getFileBrowserStorageUrl,
  recoverBlobWithUrl,
  getRusDateTime,
};

export default Utils;
