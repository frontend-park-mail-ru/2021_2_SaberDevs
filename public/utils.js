/**
 * Создает импут-поле в одну строку
 * @param {string} type
 * @param {string} placeholder
 * @param {string} name
 * @param {string} title
 * @param {boolean} [required = false]
 * @return {HTMLInputElement}
 */
export function createInput(type, placeholder, name, title, required = false) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;
  input.required = required;
  input.title = title;

  return input;
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
  getPageHeight: getPageHeight,
  getUserWindowWidth: getUserWindowWidth,
  getUserWindowHeight: getUserWindowHeight,
  getCurrentPageYPos: getCurrentPageYPos,
};

export default Utils;
