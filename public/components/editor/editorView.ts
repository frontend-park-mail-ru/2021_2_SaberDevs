// TODO: убрать из view'хи внутренние вьюхи

import BaseComponentView from '../_basic/baseComponentView';
import BaseComponent from '../_basic/baseComponent';
import articleEditorComponent from '../editor/articleEditor.pug.js';
import tagComponent from './tag.pug.js';
import cardComponent from '../feed/card.pug.js';

import CategoryChoiceBar from '../categoryChoiceBar/categoryChoiceBar';

import {genRanHexColor} from '../../common/utils.js';

import {User} from '../../common/types';
import {FluxActionType} from '../../flux/types';
import {EditorAction} from '../../flux/reducers/editorReducer';
import {KeyElementsMap, IKeyElementsMap} from '../_basic/baseComponentView';

interface IKeyElementsMapEditor extends IKeyElementsMap {
  textArea: HTMLTextAreaElement;
  titleInput: HTMLInputElement;
  stageOneDiv: HTMLDivElement;
  stageTwoDiv: HTMLDivElement;
  btnToFirstStage: HTMLButtonElement;
  btnToSecondStage: HTMLButtonElement;
  tagInput: HTMLInputElement;
  tagBox: HTMLDivElement;
  tagAddBtn: HTMLButtonElement;
  btnClear: HTMLButtonElement;
  btnDelete: HTMLButtonElement;
  form: HTMLFormElement;
  btnClearPhoto: HTMLInputElement;
  photoInput: HTMLInputElement;
  titleDiv: HTMLDivElement;
  submitBtn: HTMLInputElement;
  previewTitle: HTMLDivElement;
  previewImage: HTMLDivElement;
  previewText: HTMLDivElement;
  previewCategory: HTMLDivElement;
};

export type KeyElementsMapEditor = KeyElementsMap<IKeyElementsMapEditor>;

const PREVIEW_TEXT_LIMIT = 350;
const whiteTextColor = '#dee4ea';

// TODO: убрать
type ComponentsMap = {
  [key: string]: BaseComponent;
}

/**
 * @param {Date} d
 * @return {string} hh:mm dd.mm.yyyy
 */
function convertDate(d: Date = new Date()): string {
  const pad: (s: number) => string = (s) => (s < 10) ? '0' + s : '' + s;
  return [pad(d.getHours()), pad(d.getMinutes())].join(':') + ' ' +
  [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

/**
 * @param {string} url
 * @return {string}
 */
function fillCardImgStyle(url: string): string {
  // старый стиль. покрытие всей карточки затенением
  // return `background: -webkit-gradient(linear, left top, left bottom,` +
  // `from(rgba(0, 0, 0, 0.7)), to(rgba(0, 0, 0, 0.7))), url(${url});`+
  // `background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),` +
  // `url(${url});
  // background-size: cover;
  // background-repeat: no-repeat;`;
  return `background-image: url(${url});`;
}

/**
 * @class EditorView
 */
export default class EditorView extends BaseComponentView {
  keyElems: KeyElementsMapEditor = null;
  innerComponents: ComponentsMap;
  root: null | HTMLDivElement = null;
  previewBox: null | HTMLDivElement;

  /**
   * Компонент редактора
   * @param {Function} getCurrentSelection
   * @param {Function<string>} setSelection
   * @param {Function} clearSelection
   * @param {FluxActionType} SELECT_TYPE
   */
  constructor(
    getCurrentSelection: () => string,
    setSelection: (category: string) => EditorAction,
    clearSelection: () => EditorAction,
    SELECT_TYPE: FluxActionType,
  ) {
    super();
    this.innerComponents = {
      categoryChoiceBar: new CategoryChoiceBar(
          getCurrentSelection, setSelection, clearSelection, SELECT_TYPE,
      ),
    };
    this.previewBox = null;
  }

  /**
   * @param {User} author
   * @return {HTMLElement}
   */
  render(author: User): HTMLElement {
    const editor = document.createElement('div');
    editor.innerHTML = <string> articleEditorComponent();

    this.root = <HTMLDivElement> editor.firstElementChild;

    const currentCategory = this.root.querySelector('#article-category-selector');
    currentCategory.appendChild(this.innerComponents.categoryChoiceBar.render());
    // немного другие стили
    this.root.querySelector('.plate')
        .className = 'article-create__category_selector';

    const previewBox =
      this.root.querySelector('.article-create__preview__content');

    previewBox.innerHTML = <string> cardComponent({
      id: '-preview',
      datetime: convertDate(),
      category: {
        categoryContent: 'категория не выбрана',
        categoryColor: whiteTextColor,
      },
      author,
      comments: '',
      likes: '',
    });
    // имитация лайков
    this.previewBox.querySelector('.card__bottom')
        .innerHTML = `
          <div class="icon action-btns__likes-icon icon__img"></div>
          <div class="icon-margin-r action-btns__dislike-icon icon__img"></div>
          <div class="icon action-btns__comments-icon icon__img"></div>
        `;
    ;

    
    const textArea = <HTMLTextAreaElement> this.root.querySelector('textarea');
    const titleInput = <HTMLInputElement> this.root.querySelector('input[name="title"]');
    const stageOneDiv = <HTMLDivElement> this.root.querySelector('.article-create__stage-1');
    const stageTwoDiv = <HTMLDivElement> this.root.querySelector('.article-create__stage-2');
    const btnToFirstStage = <HTMLButtonElement> this.root.querySelector('#btn-to-first-stage');
    const btnToSecondStage = <HTMLButtonElement> this.root.querySelector('#btn-to-second-stage');
    const tagBox = <HTMLDivElement> previewBox.querySelector('.tags__row');
    const tagInput = <HTMLInputElement> previewBox.querySelector('input[name="tag"]');
    const tagAddBtn = <HTMLButtonElement> this.root.querySelector('.article-create__add-tag');
    const btnClear = <HTMLButtonElement> this.root.querySelector('#article-create__clear-btn');
    const btnDelete = <HTMLButtonElement> this.root.querySelector('#article-create__del-btn');
    const form = <HTMLFormElement> this.root.querySelector('form');
    const btnClearPhoto = <HTMLInputElement> this.root.querySelector('input[name="clear-photo"]');
    const photoInput = <HTMLInputElement> this.root.querySelector('input[name="photo"]');
    const titleDiv = <HTMLDivElement> this.root.querySelector('.article-create__title');
    const submitBtn = <HTMLInputElement> this.root.querySelector('input[name="btn-submit"]');
    const previewImage = <HTMLDivElement> previewBox.querySelector('.card__image');
    const previewTitle = <HTMLDivElement> previewBox.querySelector('.card__title');
    const previewText = <HTMLDivElement> previewBox.querySelector('.card__description');
    const previewCategory = <HTMLDivElement> previewBox.querySelector('.category__content');

    if (!(this.root && tagBox && textArea && titleInput && stageOneDiv
        && stageTwoDiv && btnToFirstStage && btnToSecondStage
        && tagAddBtn && tagInput && btnClear && btnDelete
        && form && btnClearPhoto && photoInput && titleDiv && submitBtn
        && previewImage && previewTitle && previewText && previewCategory)) {
      console.warn(
        '{Editor} component template contains an error',
      );
      return document.createElement('div');
    }

    this.keyElems = {
      textArea,
      titleInput,
      stageOneDiv,
      stageTwoDiv,
      btnToFirstStage,
      btnToSecondStage,
      tagInput,
      tagBox,
      tagAddBtn,
      btnClear,
      btnDelete,
      form,
      btnClearPhoto,
      photoInput,
      titleDiv,
      submitBtn,
      previewTitle,
      previewImage,
      previewText,
      previewCategory,
    }

    return this.root;
  }

  /**
   * Добавляет тег вниз страницы
   * @param {string} tag
   * @param {Function} deleteAction - вызывается при нажатии на крестик
   */
  appendTag(tag: string, deleteAction: () => void) {
    if (!this.keyElems) {
      console.warn(
        '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = <string> tagComponent({
      content: tag,
      color: genRanHexColor(tag),
      cross: true,
    });
    const tagDiv = <HTMLDivElement> wrapper.firstElementChild;
    tagDiv.querySelector('.tags__tag__del-btn').addEventListener(
        'click',
        (e: Event) => {
          deleteAction();
          tagDiv.remove();
        });
    this.keyElems.tagBox.appendChild(tagDiv);
  }

  /**
   * Стираем все выбранные теги со страницы
   */
  clearTags() {
    if (!this.keyElems) {
      console.warn(
        '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }
    this.keyElems.tagBox.innerHTML = '';
  }

  /**
   * @param {string} url
   */
  changePreviewImage(url: string) {
    if (!this.keyElems) {
      console.warn(
        '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }

    this.keyElems.previewImage.style.cssText = fillCardImgStyle(url);
  }

  /**
   * сброс фотографии
   */
  clearPreviewImage() {
    this.keyElems.previewImage.style.cssText = 'background-image = ""; min-height: 0;';
  }

  /**
   * @param {string} text
   */
  changePreviewText(text: string) {
    if (!this.keyElems) {
      console.warn(
        '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }

    if (text.length > PREVIEW_TEXT_LIMIT) {
      text = text.slice(0, PREVIEW_TEXT_LIMIT);
      text = text.substring(0, text.lastIndexOf(' ')) + '...';
    }
    this.keyElems.previewText.textContent = text;
  }

  /**
   * @param {string} text
   */
  changePreviewTitle(text: string) {
    if (!this.keyElems) {
      console.warn(
        '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }
    this.keyElems.previewTitle.textContent = text;
  }

  /**
   * @param {string} text
   */
  changePreviewCategory(text: string) {
    if (!this.keyElems) {
      console.warn(
        '{Editor} component hasn\'t been rendered yet',
      );
      return;
    }
    const categoryBox = this.keyElems.previewCategory;
    if (text === '') {
      categoryBox.textContent = 'категория не выбрана';
      categoryBox.style.color = whiteTextColor;
    } else {
      categoryBox.textContent = text;
      const categoryColor: string = genRanHexColor(text);
      categoryBox.style.color = categoryColor;
      categoryBox.style.textShadow = `${categoryColor} 0px 0px 10px`;
    }
  }

  /**
   * @param {string} title
   * @param {string} text
   */
  setContent(title: string, text: string) {
    if (!this.keyElems) {
      console.warn(
        '{Editor} can\'t use setContent: component hasn\'t been rendered yet',
      );
      return;
    }
    this.keyElems.textArea.value = text;
    this.keyElems.titleInput.value = title;
    this.changePreviewText(text);
    this.changePreviewTitle(title);
  }
}
