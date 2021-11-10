import {readerTypes} from '../types.js';

const InitialReaderState = {
  currentId: 0,
  // загруженные статьи храняться в следующем виде для больших
  // офлайн возможностей
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
  // }
};

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

    case readerTypes.OPEN_ARTICLE:
      return {
        ...state,
        currentId: action.payload,
      };
  }
  return state;
}
