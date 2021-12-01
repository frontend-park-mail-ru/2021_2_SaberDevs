import BaseComponent from '../components/_basic/baseComponent.js';
import Header from '../components/header/header.js';
import Sidebar from '../components/sidebar/sidebar.js';

// синглтоны
let header = null;
let sidebar = null;

/**
  * Генерирует HTML-страницу проекта
  * Заполняет блок .content элементами elements в порядке следования
  * @param  {string} title
  * @param  {...BaseComponent} elements
  * @return {HTMLElement}
  */
export default function createPage(title, ...elements) {
  if (header === null || sidebar === null) {
    header = new Header();
    sidebar = new Sidebar();
  }
  const bkgDiv = document.createElement('div');
  bkgDiv.className = 'background';
  const screenDiv = document.createElement('div');
  screenDiv.className = 'screen';
  const pageDiv = document.createElement('div');
  pageDiv.className = 'page';
  const pageTitleDiv = document.createElement('div');
  if (title) {
    pageTitleDiv.className = 'page_title';
    pageTitleDiv.textContent = title;
  }
  const contentDiv = document.createElement('div');
  contentDiv.className = 'content';

  elements.forEach((element) => {
    if (element instanceof BaseComponent) {
      contentDiv.appendChild(element.render());
    } else if (element instanceof HTMLElement) {
      contentDiv.appendChild(element);
    } else {
      console.warn(element, 'is not BaseComponent nor HTMLElement');
    }
  });

  pageDiv.appendChild(header.render());
  pageDiv.appendChild(pageTitleDiv);
  pageDiv.appendChild(contentDiv);
  screenDiv.appendChild(pageDiv);
  screenDiv.appendChild(sidebar.render());
  bkgDiv.appendChild(screenDiv);
  return bkgDiv;
}
