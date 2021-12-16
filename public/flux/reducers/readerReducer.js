import {readerTypes} from '../types.js';

const InitialReaderState = {
  currentId: 0,
  // загруженные статьи храняться в следующем виде для
  // качественных офлайн возможностей
  // id: {
  //   "previewUrl": "string",
  //   "title": "string",
  //   "text": "string",
  //   category: "string",
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
  //   commentsContent: [] || [
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
          ...action.payload,
          commentsContent: [],
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
          category: '',
          author: {
            login: '',
            avatarUrl: '',
            firstName: '',
            lastName: 'Загрузка',
            score: 0,
          },
          likes: 0,
          comments: 0,
          commentsContent: [],
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

    case readerTypes.ADD_NEW_COMMENT:
      const addCommentsCopy = [...state[state.currentId].commentsContent];
      addCommentsCopy.push(action.payload);
      return {
        ...state,
        [state.currentId]: {
          ...state[state.currentId],
          commentsContent: addCommentsCopy,
        },
      };

    case readerTypes.SAVE_ARTICLE_COMMENTS:
      // TODO: FIX API
      action.payload.comments.map((comment) => comment = {
        ...comment,
        liked: 0,
      });
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
    case readerTypes.ADD_COMMENT_ANSWER:
      const thisComments2 = state[state.currentId].commentsContent;
      if (action.payload.parentId === 0) {
        return {
          ...state,
          [state.currentId]: {
            ...[state.currentId],
            commentsContent: [...thisComments2, action.payload.comment],
          },
        };
      } else {
        const commentsIdx = thisComments2
            .findIndex(({id}) => id === action.payload.parentId);
        if (commentsIdx !== -1) {
          const commentsDeepCopy = JSON.parse(JSON.stringify(thisComments2));
          commentsDeepCopy[commentsIdx].answers.push(action.payload.answer);
          return {
            ...state,
            [state.currentId]: {
              ...state[state.currentId],
              commentsContent: commentsDeepCopy,
            },
          };
        } else {
          console.warn('коментарий с таким айди',
              action.payload.parentId, 'не найден');
        }
      }
      return state;

    case readerTypes.EDIT_ARTICLE_COMMENT:
      let answerIdx = -1;
      const thisComments = state[state.currentId].commentsContent;
      // поиск по комментам нулевого уровня
      let commentsIdx = thisComments
          .findIndex(({id}) => id === action.payload.id);
      if (commentsIdx === -1) {
        // поиск по комментам первого уровня
        commentsIdx = thisComments.findIndex(({answers}, idx) => {
          answerIdx = answers.findIndex(({id}) => id === action.payload.id);
          if (answerIdx !== -1) {
            commentsIdx = idx;
          }
        });
      }
      // поиск по комментариям 0 уровня или по ответам удался
      if (commentsIdx !== -1) {
        console.warn('коментарий с айди найден', {commentsIdx, answerIdx});
        // глубокая копия комментариев к текущей статье
        const commentsDeepCopy =
            JSON.parse(JSON.stringify(state[state.currentId].commentsContent));
        if (answerIdx !== -1) {
          commentsDeepCopy[commentsIdx][answerIdx].text = action.payload.text;
        } else {
          commentsDeepCopy[commentsIdx].text = action.payload.text;
        }
        return {
          ...state,
          [state.currentId]: {
            ...state[state.currentId],
            commentsContent: commentsDeepCopy,
          },
        };
      } else {
        console.warn('коментарий с таким айди', action.payload.id, 'не найден');
        return state;
      }

    case readerTypes.LIKE:
      if (state[action.payload.id] === undefined) {
        return state;
      }

      const likeArticleCopy = JSON.parse(
          JSON.stringify(state[action.payload.id]),
      );
      if (likeArticleCopy.liked ^ action.payload.sign === 0) {
        likeArticleCopy.liked = 0; // отменили оценку
      } else {
        likeArticleCopy.liked = action.payload.sign;
      }
      likeArticleCopy.likes = action.payload.likes;
      return {
        ...state,
        [action.payload.id]: likeArticleCopy,
      };

    case readerTypes.LIKE_COMMENT: {
      let answerIdx = -1;
      const thisComments = state[state.currentId].commentsContent;
      // поиск по комментам нулевого уровня
      let commentsIdx = thisComments
          .findIndex(({id}) => id === action.payload.id);
      if (commentsIdx === -1) {
        // поиск по комментам первого уровня
        commentsIdx = thisComments.findIndex(({answers}, idx) => {
          answerIdx = answers.findIndex(({id}) => id === action.payload.id);
          if (answerIdx !== -1) {
            commentsIdx = idx;
          }
        });
      }
      // поиск по комментариям 0 уровня или по ответам удался
      if (commentsIdx !== -1) {
        console.warn('коментарий с айди найден', {commentsIdx, answerIdx});
        // глубокая копия комментариев к текущей статье
        const commentsDeepCopy =
            JSON.parse(JSON.stringify(state[state.currentId].commentsContent));
        let changeObj = null;
        if (answerIdx !== -1) {
          changeObj = commentsDeepCopy[commentsIdx][answerIdx];
        } else {
          changeObj = commentsDeepCopy[commentsIdx];
        }
        changeObj.likes = action.payload.likes;
        if (changeObj.liked ^ action.payload.sign === 0) {
          changeObj.liked = 0; // отменили оценку
        } else {
          changeObj.liked = action.payload.sign;
        }
        console.warn(commentsDeepCopy);
        return {
          ...state,
          [state.currentId]: {
            ...state[state.currentId],
            commentsContent: commentsDeepCopy,
          },
        };
      } else {
        console.warn('коментарий с таким айди', action.payload.id, 'не найден');
        return state;
      }
    }
  }
  return state;
}
