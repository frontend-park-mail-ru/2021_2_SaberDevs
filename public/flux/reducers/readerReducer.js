import {readerTypes} from '../types.js';

const InitialReaderState = {
  currentId: 0,
  // загруженные статьи храняться в следующем виде для
  // качественных офлайн возможностей
  // id: {
  //   "previewUrl": "string",
  //   "title": "string",
  //   "text": "string",
  //   "author": {
  //     "login": "string",
  //     "firstName": "string",
  //     "lastName": "string",
  //     "avatarUrl": "string",
  //     "score": 0
  //   },
  //    "datetime": "string"
  //   "comments": 0,
  //   "likes": 0,
  //   "tags": [
  //     "string"
  //   ]
  //   commentsContent: "nul" || [
  //     {
  //       answers: [
  //         Comment,
  //         ...
  //       ],
  //       "text": "string",
  //       "articleId": number,
  //       "parentId": number,
  //       "id": number,
  //       "datetime": string,
  //       "datetimeMS": number,
  //        "isEdited": true,
  //         "author": {
  //            "login": "string",
  //            "firstName": "string",
  //            "lastName": "string",
  //            "avatarUrl": "string",
  //            "score": 0
  //        }
  //      }
  //   ]
  // }
};

/**
 * @typedef {Object} Comment
 * @property {string} text
 * @property {string} articleId
 * @property {string} id
 * @property {string} dateTime
 * @property {boolean} isEdited
 * @property {User} author
 */

/**
 * @param {Object} state
 * @param {Action} action
 * @return {State}
 */
export default function readerReducer(state = InitialReaderState, action) {
  switch (action.type) {
    case readerTypes.SAVE_ARTICLE:
      return {
        ...state,
        [action.payload.id]: {
          id: action.payload.id,
          title: action.payload.title,
          text: action.payload.text,
          tags: action.payload.tags,
          datetime: action.payload.datetime,
          author: action.payload.author,
          likes: action.payload.likes,
          comments: action.payload.comments,
          previewUrl: action.payload.previewUrl,
        },
      };

    case readerTypes.SET_ARTICLE_LOADING:
      // Загрузка не ставится, если по этому id уже
      // есть хотя бы какие-то достоверные данные
      if (action.payload.id in state &&
        state[action.payload.id].title !== 'Загрузка') {
        return state;
      }
      return {
        ...state,
        [action.payload.id]: {
          title: 'Загрузка',
          tags: [],
          datetime: '',
          author: {
            login: '',
            avatarUrl: '',
            firstName: '',
            lastName: 'Загрузка',
            score: 0,
          },
          likes: 0,
          comments: 0,
          commentsContent: null,
          previewUrl: '',
          ...action.payload,
          text: 'Загрузка...',
        },
      };

    case readerTypes.OPEN_ARTICLE:
      return {
        ...state,
        currentId: action.payload,
      };

    case readerTypes.SAVE_ARTICLE_COMMENTS:
      if (action.payload.id in state) {
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            commentsContent: action.payload.comments,
          },
        };
      } else {
        return state;
      }
  }
  return state;
}
