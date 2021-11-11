import BasePageView from './basePageView.js';
import createPage from './_createPage.js';

import Feed from '../components/feed/feed.js';
import TagChoiceBar from
  '../components/tagChoiceBar/tagChoiceBar.js';
import categoriesComponent from '../components/categories/categories.pug.js';

import {categoryPageTypes} from '../flux/types.js';
import {categoryPageActions} from '../flux/actions.js';

// ///////////////////////////////// //
//
//          Category Page
//
// ///////////////////////////////// //

/**
 * Страница содержит главный компонент - ленту новостей, с фильтром по тегам.
 * @class CategoryPage
 */
export default class CategoryPageView extends BasePageView {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    // root не трогать
    super(root);

    this.pageComponents = {
      categoryChoose: new TagChoiceBar(),
      feed: new Feed(
          'categoryPage',
          categoryPageTypes.SAVE_NEW_CATEGORY_ARTICLES,
          categoryPageTypes.CLEAR_CATEGORY_ARTICLES,
          categoryPageTypes.FORBID_CATEGORY_ARTICLES_UPLOADING,
          categoryPageTypes.ALLOW_CATEGORY_ARTICLES_UPLOADING,
          categoryPageActions.forbidCategoryArticlesLoading,
          () => {
            console.log('{CategoryPage feed} isEndFound is not been reset');
            return {type: '__EMPTY__'};
          },
      ),
    };
  }

  /**
    * Перерисовать главную страницу
    */
  render() {
    super.render();
    const categoriesPage = document.createElement('div');
    categoriesPage.className = 'categories';

    categoriesPage.innerHTML = categoriesComponent({});
    categoriesPage.appendChild(this.pageComponents.categoryChoose.render());

    // Выводятся нужные теги при вводе в поисковую строку (поиск)
    const showMatch = function(elem, pos, len) {
      console.log('pos: ', pos, ' len: ', len, ' val: ',
          elem.slice(pos, pos + len));
      return elem.slice(0, pos) + '<span class="categories__tag_mark">' +
        elem.slice(pos, pos + len) + '</span>' + elem.slice(pos + len);
    };

    categoriesPage.querySelector('#categories-search').oninput = function() {
      const val = this.value.trim();
      const categories = document.querySelectorAll('.categories__tag');
      if (val != '') {
        categories.forEach(function(elem) {
          const pos = elem.innerText.search(val);
          if (pos == -1) {
            elem.classList.add('hide');
            elem.innerHTML = elem.innerText;
          } else {
            elem.classList.remove('hide');
            const categoryText = elem.innerText;
            elem.innerHTML = showMatch(categoryText, pos, val.length);
          }
        });
      } else {
        categories.forEach(function(elem) {
          elem.classList.remove('hide');
          elem.innerHTML = elem.innerText;
        });
      }
    };

    this.root.appendChild(createPage(
        categoriesPage,
        this.pageComponents.feed,
    ));
  }
}
