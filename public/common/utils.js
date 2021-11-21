// ///////////////////////////////// //
//
//                utils
//
// ///////////////////////////////// //

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
 * генерирует рандомный цвет
 * @param {number} size
 * @return {string}
 */
export function genRanHexColor() {
  // https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
  // функция из PHP
  // цвет считается ярким, если яркость больше 155, тусклым, если < 40
  while (true) {
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);
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
};

export default Utils;
