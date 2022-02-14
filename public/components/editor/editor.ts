import BaseComponent from '../_basic/baseComponent';
import EditorView from './editorView';
import ModalTemplates from '../modal/modalTemplates.js';

import Ajax from '../../modules/ajax';
import {
  redirect,
  getFileBrowserStorageUrl,
  recoverBlobWithUrl,
  spanColor,
} from '../../common/utils.js';

import store from '../../flux/store';
import editorActions from '../../flux/actions/editorActions';
import authorizationActions from '../../flux/actions/authorizationActions';
import {EditorTypes} from '../../flux/types';

import articleLimitations from '../../common/articleLimitations.js';
import {ajaxDebug} from '../../globals';

import {EditorStateObject} from '../../flux/reducers/editorReducer';
import {KeyElementsMapEditor} from './editorView';

type ArticleEditableContent = {
  previewUrl: string,
  title: string,
  text: string,
  category: string,

  // id?: ArticleId,
  // author?: User,
  // datetime?: string
  // comments?: number,
  // likes?: number,
  // liked?: boolean,
  // tags?: string[],
  // commentsContent?: (Comment & {answers: Comment[]})[],
}

/**
   * Проверяет состояние editor
   * @return {boolean}
   */
function isUpdateFromState(): boolean {
  const state = store.getState().editor;
  return state.currentId !== 0;
}

/**
 * Компонент редактора статей
 * @class Editor
 */
export default class Editor extends BaseComponent {
  view: EditorView;

  /**
   * Окошко сообщений о состоянии сервиса
   */
  constructor() {
    super();
    this.view = new EditorView(
        () => {
          const state = store.getState().editor;
          return state[state.currentId]?.category || '';
        },
        editorActions.saveCategory,
        editorActions.clearCategory,
        EditorTypes.SAVE_CATEGORY,
    );

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    this.unsubscribes.push(
        store.subscribe(EditorTypes.CLEAR_ARTICLE, () => {
          this.clear();
        }),
        store.subscribe(EditorTypes.PUBLISH_ARTICLE, () => {
          this.clear();
        }),
        store.subscribe(EditorTypes.CREATE_ARTICLE, () => {
          this.changeToCreateMode();
          this.setContent(store.getState().editor[0]);
        }),
        store.subscribe(EditorTypes.EDIT_EXISTING_ARTICLE, ({id}) => {
          this.changeToUpdateMode();
          this.setContent(store.getState().editor[id]);
        }),
        store.subscribe(EditorTypes.SAVE_CATEGORY, (category) => {
          this.view.changePreviewCategory(category);
        }),
    );
  }

  get keyElems(): KeyElementsMapEditor {
    return this.view.keyElems; 
  }


  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render(): HTMLElement {
    super.render();
    this.root = this.view.render(store.getState().authorization);

    
    const state = store.getState().editor;

    // Проверяем, было ли вызвано событие EDIT_EXISTING_ARTICLE
    // до рендера. Если было, то в сторе есть изменения.
    // Проверяем, что стор неинициализирован. такое бывает, если перешли
    // в редактор по урлу. Должен быть редирект на логин
    if (!state[state.currentId]) {
      store.dispatch(editorActions.createArticle());
    }

    this.setContent(state[state.currentId]);
    // TODO: проверить
    // if (typeof state.currentId === 'string' && state.currentId !== '0' ||
    //     typeof state.currentId === 'number' && state.currentId !== 0) {
    if (state.currentId !== 0) {
      this.changeToUpdateMode();
    } else {
      this.changeToCreateMode();
    }

    state[state.currentId].tags.forEach((tag: string) => {
      this.view.appendTag(
        tag,
        () => store.dispatch(editorActions.removeTag(tag)),
      );
    });

    // //////////////////////////////////
    //
    //          Обработчики
    //
    // //////////////////////////////////

    
    if (!(this.keyElems)) {
      console.warn('{Editor} component template error');
      return;
    }

    // переключение между страницами
    this.keyElems.btnToFirstStage.addEventListener(
        'click',
        (e: Event) => {
          e.preventDefault();
          this.keyElems.stageOneDiv.style.display = 'flex';
          this.keyElems.stageTwoDiv.style.display = 'none';
        },
    );
    this.keyElems.btnToSecondStage.addEventListener(
        'click',
        (e: Event) => {
          e.preventDefault();
          // обновляем превью
          this.view.changePreviewText(this.keyElems.textArea.value.trim());
          this.view.changePreviewTitle(this.keyElems.titleInput.value.trim());
          this.keyElems.stageTwoDiv.style.display = 'block';
          this.keyElems.stageOneDiv.style.display = 'none';
        },
    );

    // игнор клика ентер на инпутах кроме инпута тега
    this.root.querySelectorAll('input').forEach((el: HTMLInputElement) => {
      if (el.classList.contains('article-create__input-tag')) {
        return;
      }
      el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const ct = <HTMLInputElement> e.currentTarget;
          ct.blur();
        }
      });
    });

    // обработчик добавления тега
    const tagAddListener = (e: Event) => {
      e.preventDefault();

      if (e instanceof KeyboardEvent && e.key !== 'Enter') {
          return;
      }

      const state: EditorStateObject = store.getState().editor;
      const storedTags: string[] = state[state.currentId].tags;
      const tag: string = this.keyElems.tagInput.value.trim().replace(/\s+/g, '_');

      // Проверка, а есть ли уже такой тег?
      if (tag === '' || storedTags.includes(tag)) {
        return;
      }
      // проверка, не превышено ли количество тегов
      if (storedTags.length >= articleLimitations.tagsLenght) {
        ModalTemplates.warn(
            'Ух, сколько тегов!',
            'Не следует добавлять больше, чем ' +
                articleLimitations.tagsLenght,
        );
        return;
      }
      store.dispatch(editorActions.appendTag(tag));
      this.view.appendTag(
        tag,
        () => store.dispatch(editorActions.removeTag(tag)),
      );
      this.keyElems.tagInput.value = '';
      // TODO: проверить, теряется ли фокус
      // tagInput.focus();
    };
    this.keyElems.tagAddBtn.addEventListener(
      'click',
      tagAddListener,
    );
    this.keyElems.tagInput.addEventListener(
      'keydown',
      tagAddListener,
    );

    // Сохранение введенного пользователем текста onChange
    // (Этот евент не рейзится, если textValue меняется программой)
    // Это нужно для дублирования введенного текста на превью
    this.keyElems.titleInput.addEventListener('input', (e: Event) => {
      const title: string = titleInput.value.trim();
      if (title.length >= articleLimitations.headerLenght) {
        ModalTemplates.informativeMsg(
            'Длинные заголовки',
            'не помогут привлечь читателей',
        );
        titleInput.value = titleInput.value
            .slice(0, articleLimitations.headerLenght - 1);
        return;
      }
      store.dispatch(editorActions.saveTitle(title));
    });
    this.keyElems.textArea.addEventListener('change', (e: Event) => {
      store.dispatch(editorActions.saveText(this.keyElems.textArea.value.trim()));
    });

    // сброс полей статьи
    this.keyElems.btnClear.addEventListener('click', (e: Event) => {
      e.preventDefault();
      ModalTemplates.confirm(
        'Вы собираетесь очистить всё',
        'Продолжив, Вы безвозвратно сотрете то, что написали',
        () => {
          store.dispatch(editorActions.clearArticle());
          this.clear();
        });
    });

    // удаление статьи
    const articleId = store.getState().editor.currentId;
    this.keyElems.btnDelete.addEventListener('click', (e: Event) => {
        e.preventDefault();
        ModalTemplates.confirm(
          'Точно хотите удалить?',
          'Продолжив, вы удалите статью',
          () => {
            Ajax.post({
              url:
                `/articles/delete?id=${articleId}`,
              body: {},
            }).then(({status, response}) => {
              if (status === Ajax.STATUS.ok) {
                // диспатчим общее событие для 4-х лент.
                // Все ленты отреагируют
                // одинаково за счет общего типа
                store.dispatch(editorActions.deleteArticle(
                    articleId,
                ));
                ModalTemplates.
                    informativeMsg('Успех!', 'Статья была удалена');
                redirect('/profile');
                return;
              }
              if (status === Ajax.STATUS.invalidSession) {
                store.dispatch(authorizationActions.logout());
                ModalTemplates.signup(false);
                return;
              }
              // В случае ошибки
              // пусть модалка закроется
              setTimeout(() => ModalTemplates
                  .netOrServerError(status, response.msg), 200);
            });
          });
      },
    );

    // сабмит формы
    this.keyElems.form.addEventListener('submit', (e: Event) => {
      e.preventDefault();

      const text:  string = textArea.value.trim();
      const title: string = titleInput.value.trim();

      if (!store.getState().authorization.firstName ||
      !store.getState().authorization.lastName) {
        const extraMsg: string = spanColor('Важно!', 'red') +
            ' Если хотите сохранить статью не перезагружайте страницу!';
        ModalTemplates.needFullRegConfirm(
            'Только пользователи, указавшие имя и фамилию могут стать авторами.',
            text !== '' ? extraMsg : '',
        );
        return;
      }

      if (!text || !title || text === '' || title === '') {
        console.warn('{Editor} пустые статьи - это плохо:', {text}, {title});
        ModalTemplates.informativeMsg(
            'Что-то не так', 'Заголовок и текст статьи не должны быть пустыми',
        );
        return;
      }

      const state: EditorStateObject = store.getState().editor;
      const isUpdate: boolean = isUpdateFromState();

      const category: string = state[state.currentId].category;
      if (state[state.currentId].category === '') {
        ModalTemplates.warn(
            'Что-то не так',
            'Не забудьте указать одну из категорий, наиболее ' +
            'точно описывающую Вашу статью',
        );
        return;
      }

      const body = {
        title,
        text,
        category,
        // img: 'добавляем ниже',
        tags: state[state.currentId].tags,
      };
      if (isUpdate) {
        Object.assign(body, {id: state.currentId});
      }

      let responseStatus: number = 0;
      recoverBlobWithUrl(state[state.currentId].previewUrl)
          .then((blob) => Ajax.postFile({url: '/img/upload', body: blob}))
          .then(({status, response}) => new Promise((resolve, reject) => {
            if (status === Ajax.STATUS.ok) {
              resolve(response.data.imgId);
            } else {
              responseStatus = status;
              reject(new Error(response.msg));
            }
          }))
          // Если падает Blob то надо восстановить цепочку,
          // а если Ajax, то перейти в конец
          .catch((err: Error) => new Promise((resolve, reject) => {
            // упал Blob, а не сеть -> продолжить без картинки
            if (responseStatus === 0) {
              resolve('');
            } else {
              reject(err);
            }
          }))
          .then((img: string) => Ajax.post({
            url: `/articles/${isUpdate ? 'update' : 'create'}`,
            body: {...body, img},
          }))
          .then(({status, response}) => new Promise((resolve, reject) => {
            if (status === Ajax.STATUS.ok) {
              resolve(response.data);
            } else {
              responseStatus = status;
              reject(new Error(response.msg));
            }
          }))
          .then((id: number) => {
            store.dispatch(editorActions.publishArticle(id));
            ModalTemplates.informativeMsg(
              'Успех!', `Статья успешно ${isUpdate ? 'изменена' : 'создана'}`,
            );
            redirect(`/article/${isUpdate ? state.currentId : id}`);
          })
          .catch(({message} : Error) => {
            if (responseStatus === Ajax.STATUS.invalidSession) {
              store.dispatch(authorizationActions.logout());
              ModalTemplates.signup(false);
              return;
            }
            if (ajaxDebug) {
              console.warn(message);
            }
            ModalTemplates.netOrServerError(responseStatus, message);
          });
    });

    // Загрузка превьюхи
    this.keyElems.photoInput.addEventListener('change', (e: Event) => {
      const file: File = (<HTMLInputElement>e.currentTarget).files[0];

      if (!file.type.startsWith('image/')) {
        ModalTemplates.warn('Что-то не так', 'Выберите изображение');
        return;
      }
      getFileBrowserStorageUrl(file).then((imgUrl) => {
        this.view.changePreviewImage(imgUrl);
        store.dispatch(editorActions.saveImg(imgUrl));
      });
    });

    // удаление фото с превью
    this.keyElems.btnClearPhoto.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.view.clearPreviewImage();
      store.dispatch(editorActions.clearImg());
    });

    return this.root;
  }

  /**
    * Перерисовать главную страницу
    * @param {Article} ArticleEditableContent
    * @property {string} title
    * @property {string} text
    * @property {string} previewUrl
    * @property {string} category
    */
  setContent({title, text, previewUrl, category}: ArticleEditableContent) {
    if (title || text) {
      console.log('{EDITOR} set content');
    }
    this.view.setContent(title, text);
    this.view.changePreviewCategory(category);
    if (!previewUrl) {
      return;
    }
    if (previewUrl !== '') {
      this.view.changePreviewImage(previewUrl);
    } else {
      this.view.clearPreviewImage();
    }
  }

  /**
   * сбросить value форм
   */
  clear() {
    console.log('{EDITOR} clear');
    this.setContent({
      title: '',
      text: '',
      previewUrl: '',
      category: '',
    });
    this.view.clearTags();
  }

  /**
   * Поменять надписи на "Создание" статьи
   */
  changeToCreateMode() {
    if (!this.keyElems) {
      console.warn(
        `{Editor} can\'t use changeToCreateMode:
        component hasn\'t been rendered yet`,
      );
      return;
    }
    this.keyElems.submitBtn.value = 'Создать';
    this.keyElems.titleDiv.textContent = 'Создание статьи';
    this.keyElems.btnDelete.style.display = 'none';
    this.view.category.style.display = 'flex';
  }

  /**
   * Поменять надписи на "Изменение"
   */
  changeToUpdateMode() {
    if (!this.keyElems) {
      console.warn(
        `{Editor} can\'t use changeToCreateMode:
        component hasn\'t been rendered yet`,
      );
      return;
    }
    this.keyElems.submitBtn.value = 'Изменить';
    this.keyElems.titleDiv.textContent = 'Изменение статьи';
    this.keyElems.btnDelete.style.display = 'flex';
    // запрещаем менять категории при редактировании
    this.view.category.style.display = 'none';
  }
}
