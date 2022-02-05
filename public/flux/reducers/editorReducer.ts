import {EditorTypes, CommonTypes, FluxStateObject, FluxAction} from '../types';
import {Article} from './readerReducer';

export interface EditorStateObject extends FluxStateObject {
  currentId: number,
  [key: number]: Article,
};

export type EditorAction = FluxAction<EditorTypes | CommonTypes>;

const InitialEditorState = {
  currentId: 0,
  // создание статьи
  // 0: {
  //   title: string,
  //   text: string,
  //   tags: [string],
  //   category: string,
  //   previewUrl: string,
  // }
  // Изменение статьи
  // id: {
  //   title: string,
  //   text: string,
  //   tags: [string...],
  //   category: string,
  //   previewUrl: string
  // }
};

/**
 * @param {EditorStateObject} state
 * @param {EditorAction} action
 * @return {EditorStateObject}
 */
export default function editorReducer(state: EditorStateObject = InitialEditorState, action: EditorAction): EditorStateObject {
  switch (action.type) {
    case EditorTypes.EDIT_EXISTING_ARTICLE:
      return {
        ...state,
        currentId: action.payload.id,
        [action.payload.id]: <Article>{
          title: action.payload.title,
          text: action.payload.text,
          tags: action.payload.tags,
          category: action.payload.category,
          previewUrl: action.payload.previewUrl,
        },
      };

    case EditorTypes.CLEAR_ARTICLE:
      return {
        ...state,
        [state.currentId]: <Article>{
          title: '',
          text: '',
          tags: [],
          category: '',
          previewUrl: '',
        },
      };

    case CommonTypes.DELETE_CARD:
      const stateCopyDel = <EditorStateObject>{};
      Object.assign(stateCopyDel, state);
      delete stateCopyDel[action.payload];
      stateCopyDel.currentId = 0;
      return stateCopyDel;

    case EditorTypes.CREATE_ARTICLE:
      const stateCopy = Object.assign({}, state);
      // обнуление только если до этого не создавали статью
      // иначе данные, введенные ранее должны быть сохранены
      if (!(0 in stateCopy)) {
        stateCopy[0] = <Article>{
          title: '',
          text: '',
          tags: [],
          category: '',
          previewUrl: '',
        };
      }
      stateCopy.currentId = 0;
      return stateCopy;

    case EditorTypes.SAVE_TEXT:
      const saveTextStateCopy = Object.assign({}, state[state.currentId]);
      saveTextStateCopy.text = action.payload;
      return {
        ...state,
        [state.currentId]: saveTextStateCopy,
      };

    case EditorTypes.SAVE_TITLE:
      const saveTitleStateCopy = Object.assign({}, state[state.currentId]);
      saveTitleStateCopy.title = action.payload;
      return {
        ...state,
        [state.currentId]: saveTitleStateCopy,
      };

    case EditorTypes.PUBLISH_ARTICLE:
      return {
        ...state,
        // сохраняем только что созданную запись
        [action.payload.id]: Object.assign({}, state[0]),
        0: <Article>{
          title: '',
          text: '',
          tags: [],
          category: '',
          previewUrl: '',
        },
        currentId: 0,
      };

    case EditorTypes.APPEND_TAG:
      const currentIdStateCopy = Object.assign({}, state[state.currentId]);
      currentIdStateCopy.tags.push(action.payload);
      return {
        ...state,
        [state.currentId]: currentIdStateCopy,
      };

    case EditorTypes.REMOVE_TAG:
      const currentStateCopyRemove = Object.assign({}, state[state.currentId]);
      currentStateCopyRemove.tags =
          currentStateCopyRemove.tags.filter((el) => el != action.payload);
      return {
        ...state,
        [state.currentId]: currentStateCopyRemove,
      };

    case EditorTypes.SAVE_PREVIEW:
      const currentStateCopySavePreview = {...state[state.currentId]};
      currentStateCopySavePreview.previewUrl = action.payload;
      return {
        ...state,
        [state.currentId]: currentStateCopySavePreview,
      };

    case EditorTypes.SAVE_CATEGORY:
      const currentStateCopySaveCategory = {...state[state.currentId]};
      currentStateCopySaveCategory.category = action.payload;
      return {
        ...state,
        [state.currentId]: currentStateCopySaveCategory,
      };
  }
  return state;
}
