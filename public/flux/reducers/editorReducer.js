import {editorTypes} from '../types.js';

const InitialEditorState = {
  currentId: 0,
  // создание статьи
  // 0: {
  //   title: string,
  //   text: string,
  // }
  // Изменение статьи
  // id: {
  //   title: string,
  //   text: string,
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
      return {
        ...state,
        [action.payload.id]: {
          title: action.payload.title,
          text: action.payload.text,
        },
        currentId: action.payload.id,
      };

    case editorTypes.CLEAR_ARTICLE:
      return {
        ...state,
        [action.payload.id]: {
          title: '',
          text: '',
        },
      };

    case editorTypes.CREATE_ARTICLE:
      const stateCopy = Object.assign({}, state);
      // обнуление только если до этого не создавали статью
      // иначе данные, введенные ранее должны быть сохранены
      if (!(0 in stateCopy)) {
        stateCopy[0] = {
          title: '',
          text: '',
        };
      }
      stateCopy.currentId = 0;
      return stateCopy;

    case editorTypes.SAVE_ARTICLE:
      return {
        ...state,
        [action.payload.id]: {
          title: action.payload.title,
          text: action.payload.text,
        },
      };
    case editorTypes.PUBLISH_ARTICLE:
      return {
        ...state,
        // сохраняем только что созданную запись
        [action.payload.id]: Object.assign({}, state[0]),
        0: {
          title: '',
          text: '',
        },
        currentId: 0,
      };
  }
  return state;
}
