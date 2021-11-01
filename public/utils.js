// ///////////////////////////////// //
//
//                utils
//
// ///////////////////////////////// //

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
 * Создает импут-поле в одну строку
 * @param {string} type
 * @param {string} placeholder
 * @param {string} name
 * @param {string} title
 * @param {boolean} [required = false]
 * @return {HTMLInputElement}
 */
export function createInput(
    type,
    placeholder,
    name,
    title = null,
    required = false,
) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = 'input-' + name;
  input.placeholder = placeholder;
  input.required = required;
  input.title = title;

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
  createInput: createInput,
  createLabel: createLabel,
  createInputRow: createInputRow,
  getPageHeight: getPageHeight,
  getUserWindowWidth: getUserWindowWidth,
  getUserWindowHeight: getUserWindowHeight,
  getCurrentPageYPos: getCurrentPageYPos,
};

export default Utils;
