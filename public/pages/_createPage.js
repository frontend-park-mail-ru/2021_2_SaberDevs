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

  // связываем кнопку в хедере с отображением сайдбара для мобилки
  const menuBtn = pageDiv
      .querySelector('.header__search-btn-mobile-hideble');
  const container = screenDiv.querySelector('.sidebar__overlay-container');
  const sidebarDiv = screenDiv.querySelector('.sidebar');
  const searchBtn = pageDiv.querySelector('.header__search-btn');
  const overlay = screenDiv.querySelector('.sidebar__overlay');

  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!searchBtn.classList.contains('hide')) {
      container.style.display = 'flex';
      overlay.style.display = 'flex';
      sidebarDiv.style.display = 'flex';

      e.currentTarget.style.display = 'none';
      searchBtn.style.display = 'none';
    }
  });

  const closeSideBar = () => {
    container.style.display = 'none';
    overlay.style.display = 'none';
    sidebarDiv.style.display = 'none';

    searchBtn.style.display = 'flex';
    menuBtn.style.display = 'flex';
  };

  overlay.addEventListener('click', (e) => {
    e.preventDefault();
    closeSideBar();
  });

  const widthMatch = window.matchMedia('(min-width: 901px)');
  widthMatch.addEventListener('change', (e) => {
    closeSideBar();
    // восттанови исходное состояние полностью, т.к.
    container.style.display = '';
    sidebarDiv.style.display = '';
  });

  return bkgDiv;
}
