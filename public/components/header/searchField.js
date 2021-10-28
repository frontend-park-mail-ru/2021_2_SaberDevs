/**
 * @class searchField
 * @module searchField
 */
export default function searchField() {
  const navItems = document.getElementsByClassName('header__nav-items')[0];
  const searchButton = document.getElementsByClassName('search__button')[0];
  const searchInput = document.getElementsByClassName('search__input')[0];

  if (searchButton.classList.contains('search__button_search-icon')) {
    console.log('to open');
    navItems.style.pointerEvents = 'none';
    searchButton.classList.remove('search__button_search-icon');
    searchButton.classList.add('search__button_cross-icon');
    searchInput.classList.remove('search__input_close');
    searchInput.classList.add('search__input_open');
  } else if (searchButton.classList.contains('search__button_cross-icon')) {
    console.log('to close');
    navItems.style.pointerEvents = 'all';
    searchButton.classList.add('search__button_search-icon');
    searchButton.classList.remove('search__button_cross-icon');
    searchInput.classList.add('search__input_close');
    searchInput.classList.remove('search__input_open');
  }
}
