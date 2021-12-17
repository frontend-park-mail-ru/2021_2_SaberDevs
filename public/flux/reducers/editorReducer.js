import {editorTypes} from '../types.js';

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
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function editorReducer(state = InitialEditorState, action) {
  switch (action.type) {
    case editorTypes.EDIT_EXISTING_ARTICLE:
      console.warn(action.payload, typeof action.payload.id)
      return {
        ...state,
        currentId: action.payload.id,
        [action.payload.id]: {
          title: action.payload.title,
          text: action.payload.text,
          tags: action.payload.tags,
          category: action.payload.category,
          previewUrl: action.payload.previewUrl,
        },
      };

    case editorTypes.CLEAR_ARTICLE:
      return {
        ...state,
        [state.currentId]: {
          title: '',
          text: '',
          tags: [],
          category: '',
          previewUrl: '',
        },
      };

    case editorTypes.DELETE_ARTICLE:
      const stateCopyDel = {};
      Object.assign(stateCopyDel, state);
      delete stateCopyDel[action.payload];
      stateCopyDel.currentId = 0;
      return stateCopyDel;

    case editorTypes.CREATE_ARTICLE:
      const stateCopy = Object.assign({}, state);
      // обнуление только если до этого не создавали статью
      // иначе данные, введенные ранее должны быть сохранены
      if (!(0 in stateCopy)) {
        stateCopy[0] = {
          title: '',
          text: '',
          tags: [],
          category: '',
          previewUrl: '',
        };
      }
      stateCopy.currentId = 0;
      return stateCopy;

    case editorTypes.SAVE_TEXT:
      const saveTextStateCopy = Object.assign({}, state[state.currentId]);
      saveTextStateCopy.text = action.payload;
      return {
        ...state,
        [state.currentId]: saveTextStateCopy,
      };

    case editorTypes.SAVE_TITLE:
      const saveTitleStateCopy = Object.assign({}, state[state.currentId]);
      saveTitleStateCopy.title = action.payload;
      return {
        ...state,
        [state.currentId]: saveTitleStateCopy,
      };

    case editorTypes.PUBLISH_ARTICLE:
      return {
        ...state,
        // сохраняем только что созданную запись
        [action.payload.id]: Object.assign({}, state[0]),
        0: {
          title: '',
          text: '',
          tags: [],
          category: '',
          previewUrl: '',
        },
        currentId: 0,
      };

    case editorTypes.APPEND_TAG:
      const currentIdStateCopy = Object.assign({}, state[state.currentId]);
      currentIdStateCopy.tags.push(action.payload);
      return {
        ...state,
        [state.currentId]: currentIdStateCopy,
      };

    case editorTypes.REMOVE_TAG:
      const currentStateCopyRemove = Object.assign({}, state[state.currentId]);
      currentStateCopyRemove.tags =
          currentStateCopyRemove.tags.filter((el) => el != action.payload);
      return {
        ...state,
        [state.currentId]: currentStateCopyRemove,
      };

    case editorTypes.SAVE_PREVIEW:
      const currentStateCopySavePreview = {...state[state.currentId]};
      currentStateCopySavePreview.previewUrl = action.payload;
      return {
        ...state,
        [state.currentId]: currentStateCopySavePreview,
      };

    case editorTypes.SAVE_CATEGORY:
      const currentStateCopySaveCategory = {...state[state.currentId]};
      currentStateCopySaveCategory.category = action.payload;
      return {
        ...state,
        [state.currentId]: currentStateCopySaveCategory,
      };
  }
  return state;
}
