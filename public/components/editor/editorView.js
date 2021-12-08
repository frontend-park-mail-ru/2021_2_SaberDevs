import BaseComponentView from '../_basic/baseComponentView.js';
import articleEditorComponent from '../editor/articleEditor.pug.js';
import tagComponent from './tag.pug.js';
import cardComponent from '../feed/card.pug.js';

import CategoryChoiceBar from '../categoryChoiceBar/categoryChoiceBar.js';

import {genRanHexColor} from '../../common/utils.js';

const PREVIEW_TEXT_LIMIT = 350;

/**
 * @param {Date} d
 * @return {string} hh:mm dd.mm.yyyy
 */
function convertDate(d = new Date()) {
  const pad = (s) => (s < 10) ? '0' + s : s;
  return [pad(d.getHours()), pad(d.getMinutes())].join(':') + ' ' +
  [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

/**
 * @param {string} url
 * @return {string}
 */
function fillCardImgStyle(url) {
  return `background: -webkit-gradient(linear, left top, left bottom,` +
  `from(rgba(0, 0, 0, 0.7)), to(rgba(0, 0, 0, 0.7))), url(${url});`+
  `background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),` +
  `url(${url});
  background-size: cover;
  background-repeat: no-repeat;`;
}

/**
 * @class EditorView
 */
export default class EditorView extends BaseComponentView {
  /**
   * Компонент редактора
   * @param {Action<string>} getCurrentSelection
   * @param {Action<string>} setSelection
   * @param {Action} clearSelection
   * @param {Type} SELECT_TYPE
   */
  constructor(getCurrentSelection, setSelection, clearSelection, SELECT_TYPE) {
    super();
    this.innerComponents = {
      categoryChoiceBar: new CategoryChoiceBar(
          getCurrentSelection, setSelection, clearSelection, SELECT_TYPE,
      ),
    };
    this.root = null;
    this.tagBox = null;
    this.previewBox = null;
    this.textAreaInput = null;
    this.titleInput = null;
    this.category = null;
  }

  /**
   * @param {object} author
   * @return {HTMLElement}
   */
  render(author) {
    const editor = document.createElement('div');
    editor.innerHTML = articleEditorComponent();

    this.category =
        editor.firstChild.querySelector('.article-create__category_selector');
    this.category.querySelector('.article-create__row')
        .appendChild(this.innerComponents.categoryChoiceBar.render());
    // немного другие стили
    editor.firstChild.querySelector('.plate')
        .className = 'article-create__category_selector';

    this.previewBox =
        editor.firstChild.querySelector('.article-create__preview__content');
    this.previewBox.innerHTML = cardComponent({
      id: '-preview',
      datetime: convertDate(),
      category: {
        categoryContent: 'категория не выбрана',
        categoryColor: '#dee4ea',
      },
      author,
      comments: '',
      likes: '',
    })
        .replace('card__lift-effect', '');

    this.tagBox = this.previewBox.querySelector('.tags__row');
    this.textAreaInput = editor.firstChild.querySelector('textarea');
    this.titleInput = editor.firstChild.querySelector('input[name="title"]');
    this.root = editor.firstChild;

    return editor.firstChild;
  }

  /**
   * Добавляет тег вниз страницы
   * @param {string} tag
   * @param {function} deleteAction
   */
  appendTag(tag, deleteAction) {
    if (this.tagBox === null ) {
      console.warn(
          '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = tagComponent({
      content: tag,
      color: genRanHexColor(tag),
      cross: true,
    });
    const tagDiv = wrapper.firstChild;
    tagDiv.querySelector('.tags__tag__del-btn').addEventListener(
        'click',
        (e) => {
          deleteAction();
          tagDiv.remove();
        });
    this.tagBox.appendChild(tagDiv);
  }

  /**
   * Стираем все выбранные теги со страницы
   */
  clearTags() {
    if (this.tagBox === null ) {
      console.warn(
          '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }
    this.tagBox.innerHTML = '';
  }

  /**
   * @param {string} url
   */
  changePreviewImage(url) {
    if (this.previewBox === null ) {
      console.warn(
          '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }

    this.previewBox.querySelector('.article-create__preview__card')
        .style.cssText = fillCardImgStyle(url);
  }

  /**
   * сброс фотографии
   */
  clearPreviewImage() {
    this.previewBox.querySelector('.article-create__preview__card')
        .style.cssText = '';
  }

  /**
   * @param {string} text
   */
  changePreviewText(text) {
    if (this.previewBox === null ) {
      console.warn(
          '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }
    text = text.slice(0, PREVIEW_TEXT_LIMIT);
    this.previewBox.querySelector('.card__description').textContent = text;
  }

  /**
   * @param {string} text
   */
  changePreviewTitle(text) {
    if (this.previewBox === null ) {
      console.warn(
          '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }
    this.previewBox.querySelector('.card__title').textContent = text;
  }

  /**
   * @param {string} text
   */
  changePreviewCategory(text) {
    if (this.previewBox === null || this.root === null) {
      console.warn(
          '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }
    if (text === '') {
      this.previewBox.querySelector('.category__content').textContent =
        'категория не выбрана';
      this.root.querySelector('.article-create__label').innerHTML =
        'Выберите категорию | <strong>категория не выбрана</strong>';
    } else {
      const categoryColor = genRanHexColor(text);
      const categoryBoxTop = this.root.querySelector('.article-create__label');
      categoryBoxTop.innerHTML =
        `Выберите категорию | <strong>${text}</strong>`;
      categoryBoxTop.style.color = categoryColor;
      categoryBoxTop
          .style.textShadow = `text-shadow: ${categoryColor} 0px 0px 10px`;

      const categoryBoxPreview =
        this.previewBox.querySelector('.category__content');
      categoryBoxPreview.textContent = text;
      categoryBoxPreview.style.color = categoryColor;
      categoryBoxPreview
          .style.textShadow = `text-shadow: ${categoryColor} 0px 0px 10px`;
    }
  }

  /**
   * @param {string} title
   * @param {string} text
   */
  setContent(title, text) {
    if (this.textarea === null || this.titleInput === null) {
      console.warn(
          '{Editor} can\'t use setContent: component hasn\'t been rendered yet',
      );
      return;
    }
    this.textAreaInput.value = text;
    this.titleInput.value = title;
    this.changePreviewText(text);
    this.changePreviewTitle(title);
  }
}
