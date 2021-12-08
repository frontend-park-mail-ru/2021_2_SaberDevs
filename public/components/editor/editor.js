import BaseComponent from '../_basic/baseComponent.js';
import EditorView from './editorView.js';

import store from '../../flux/store.js';
import editorActions from '../../flux/actions/editorActions.js';
import {authorizationActions} from '../../flux/actions.js';
import {editorTypes} from '../../flux/types.js';

import Ajax from '../../modules/ajax.js';
import ModalTemplates from '../modal/modalTemplates.js';
import {
  redirect,
  getFileBrowserStorageUrl,
  recoverBlobWithUrl,
} from '../../common/utils.js';
import {ajaxDebug} from '../../globals.js';

/**
   * Проверяет состояние editor
   * @return {boolean}
   */
function isUpdateFromState() {
  const state = store.getState().editor;
  return typeof state.currentId === 'string' && state.currentId !== '0' ||
         typeof state.currentId === 'number' && state.currentId !== 0;
}

/**
 * Компонент редактора статей
 * @class Editor
 */
export default class Editor extends BaseComponent {
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
        editorTypes.SAVE_CATEGORY,
    );

    // /////////////////////////////////
    //
    //        Communication
    //
    // /////////////////////////////////

    this.unsubscribes.push(
        store.subscribe(editorTypes.CLEAR_ARTICLE, () => {
          this.clear();
        }),
        store.subscribe(editorTypes.PUBLISH_ARTICLE, () => {
          this.clear();
        }),
        store.subscribe(editorTypes.CREATE_ARTICLE, () => {
          this.changeToCreate();
          this.setContent(store.getState().editor[0]);
        }),
        store.subscribe(editorTypes.EDIT_EXISTING_ARTICLE, ({id}) => {
          this.changeToUpdate();
          this.setContent(store.getState().editor[id]);
        }),
        store.subscribe(editorTypes.SAVE_CATEGORY, (category) => {
          this.view.changePreviewCategory(category);
        }),
    );
  }


  /**
   * Перерисовка подконтрольного элемента
   * @return {HTMLElement}
   */
  render() {
    super.render();
    this.root = this.view.render(store.getState().authorization);

    // Проверяем, было ли вызвано событие EDIT_EXISTING_ARTICLE
    // до рендера. Если было, то в сторе есть изменения.
    // Проверяем, что стор неинициализирован. такое бывает, если перешли
    // в редактор по урлу. Должен быть редирект на логин
    if (!store.getState().editor[store.getState().editor.currentId]) {
      store.dispatch(editorActions.createArticle());
    }
    const state = store.getState().editor;
    this.setContent(state[state.currentId]);
    if (typeof state.currentId === 'string' && state.currentId !== '0' ||
        typeof state.currentId === 'number' && state.currentId !== 0) {
      this.changeToUpdate();
    } else {
      this.changeToCreate();
    }

    state[state.currentId].tags.forEach((tag) =>{
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

    // игнор клика ентер на инпутах
    this.root.querySelectorAll('input').forEach((el) => {
      el.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
          e.preventDefault();
          const ct = e.currentTarget;
          ct.blur();
          if (ct.classList.contains('article-create__input-tag')) {
            const tag = ct.value.trim().replace(/\s+/g, '_');
            // Проверка, а есть ли уже такой тег?
            const state = store.getState().editor;
            if (tag === '' || state[state.currentId].tags.includes(tag)) {
              return;
            }
            store.dispatch(editorActions.appendTag(tag));
            this.view.appendTag(
                tag,
                () => store.dispatch(editorActions.removeTag(tag)),
            );
            ct.value = '';
          }
        }
      });
    });


    // кнопка добавления тега
    const tagInput = this.root.querySelector('input.article-create__input-tag');
    this.root.querySelector('.article-create__add-tag').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          const tag = tagInput.value.trim().replace(/\s+/g, '_');
          // Проверка, а есть ли уже такой тег?
          const state = store.getState().editor;
          if (tag === '' || state[state.currentId].tags.includes(tag)) {
            return;
          }
          store.dispatch(editorActions.appendTag(tag));
          this.view.appendTag(
              tag,
              () => store.dispatch(editorActions.removeTag(tag)),
          );
          tagInput.value = '';
        },
    );

    const textareaInput = this.root.querySelector('textarea');
    const titleInput = this.root.querySelector('input[name="title"]');

    // Сохранение введенного пользователем текста onChange
    // Этот евент не рейзится, если textValue меняется программой
    titleInput.addEventListener('input', (e) => {
      store.dispatch(editorActions.saveTitle(titleInput.value));
    });
    textareaInput.addEventListener('change', (e) => {
      store.dispatch(editorActions.saveText(textareaInput.value));
    });

    // Дублирование измененного текста на превью
    textareaInput.addEventListener('input', (e) => {
      this.view.changePreviewText(textareaInput.value);
    });

    titleInput.addEventListener('input', (e) => {
      const title = titleInput.value;
      this.view.changePreviewTitle(title);
    });

    // сброс полей статьи
    this.root.querySelector('.article-create__clear-btn').addEventListener(
        'click',
        (e) => {
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
    this.root.querySelector('.article-create__del-btn').addEventListener(
        'click',
        (e) => {
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
    this.root.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();

      const text = this.root.querySelector('textarea')?.value.trim();
      const title= this.root.querySelector('input[name="title"]')?.value.trim();
      if (!text || !title || text === '' || title === '') {
        console.warn('{Editor} пустые статьи - это плохо:', {text}, {title});
        ModalTemplates.informativeMsg(
            'Ошибка', 'Заголовок и текст статьи не должны быть пустыми',
        );
        return;
      }

      const state = store.getState().editor;
      const isUpdate = isUpdateFromState();

      const category = state[state.currentId].category;
      if (state[state.currentId].category === '') {
        ModalTemplates.informativeMsg(
            'Ошибка', 'Не забудьте указать одну из категорий, наиболее ' +
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

      let responseStatus = 0;
      recoverBlobWithUrl(state[state.currentId].img)
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
          .catch((err) => new Promise((resolve, reject) => {
            // упал Blob, а не сеть -> продолжить без картинки
            if (responseStatus === 0) {
              resolve('');
            } else {
              reject(err);
            }
          }))
          .then((img) => Ajax.post({
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
          .then((id) => {
            store.dispatch(editorActions.publishArticle(id));
            ModalTemplates.informativeMsg(
                'Успех!', `Статья успешно ${isUpdate?'изменена' : 'создана'}`,
            );
            redirect(`/article/${isUpdate ? state.currentId : id}`);
          })
          .catch(({message}) => {
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
    this.root.querySelector('input[name="photo"]').addEventListener(
        'change',
        (e) => {
          const file = e.currentTarget.files[0];

          if (!file.type.startsWith('image/')) {
            ModalTemplates.warn('Ошибка', 'Выберите изображение');
            return;
          }
          getFileBrowserStorageUrl(file).then((imgUrl) => {
            this.view.changePreviewImage(imgUrl);
            store.dispatch(editorActions.saveImg(imgUrl));
          });
        });

    // удаление фото с превью
    this.root.querySelector('input[name="clear-photo"]').addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          this.view.clearPreviewImage();
          store.dispatch(editorActions.clearImg());
        },
    );

    return this.root;
  }

  /**
    * Перерисовать главную страницу
    * @param {Object?} existingArticle
    * @property {string} title
    * @property {string} text
    * @property {Array<string>?} tags
    * @property {number?} time
    * @property {string?} author
    * @property {number?} likes
    * @property {number?} comments
    */
  setContent({title, text, img, category}) {
    if (title || text) {
      console.log('{EDITOR} set content');
    }
    this.view.setContent(title, text);
    this.view.changePreviewCategory(category);
    if (!img) {
      return;
    }
    if (img !== '') {
      this.view.changePreviewImage(img);
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
      img: '',
      category: '',
    });
    this.view.clearTags();
  }

  /**
   * Поменять надписи на "Создание"
   */
  changeToCreate() {
    const submitBtn = this.root.querySelector('input[name="btn-submit"]');
    if (!submitBtn) {
      console.warn(
          `{Editor} can\'t use changeToCreate:
          component hasn\'t been rendered yet`,
      );
      return;
    }
    submitBtn.value = 'Создать';
    this.root.querySelector('.article-create__title').textContent =
      'Создание статьи';
    this.root.querySelector('.article-create__del-btn').style.display = 'none';
    this.view.category.style.display = 'flex';
  }

  /**
   * Поменять надписи на "Изменение"
   */
  changeToUpdate() {
    const submitBtn = this.root.querySelector('input[name="btn-submit"]');
    if (!submitBtn) {
      console.warn(
          `{Editor} can\'t use changeToCreate:
          component hasn\'t been rendered yet`,
      );
      return;
    }
    submitBtn.value = 'Изменить';
    this.root.querySelector('.article-create__title').textContent =
      'Изменение статьи';
    this.root.querySelector('.article-create__del-btn').style.display = 'flex';
    // запрещаем менять категории при редактировании
    this.view.category.style.display = 'none';
  }
}
