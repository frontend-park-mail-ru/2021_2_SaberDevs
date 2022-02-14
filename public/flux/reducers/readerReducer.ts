import {ReaderTypes, CommonTypes, FluxStateObject, FluxAction} from '../types';
import {Comment} from '../../common/types';
import {User, Article} from '../../common/types';

export interface ReaderStateObject extends FluxStateObject {
  currentId: number,
  [key: number]: Article,
};

export type ReaderAction = FluxAction<ReaderTypes | CommonTypes>;

 const InitialReaderState: ReaderStateObject = {
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
  //   commentsContent: [
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
 * @param {ReaderStateObject} state
 * @param {ReaderAction} action
 * @return {ReaderStateObject}
 */
export default function readerReducer(state: ReaderStateObject = InitialReaderState, action: ReaderAction): ReaderStateObject {
  switch (action.type) {
    case ReaderTypes.SAVE_ARTICLE:
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
          commentsContent: [],
        },
      };

    case ReaderTypes.SET_ARTICLE_LOADING:
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

    case ReaderTypes.OPEN_ARTICLE:
      return {
        ...state,
        currentId: action.payload,
      };

    case ReaderTypes.ADD_NEW_COMMENT:
      const addCommentsCopy = [...state[state.currentId].commentsContent];
      addCommentsCopy.push(<Comment & {answers: Comment[]}>action.payload);
      return {
        ...state,
        [state.currentId]: {
          ...state[state.currentId],
          commentsContent: addCommentsCopy,
        },
      };

    case ReaderTypes.SAVE_ARTICLE_COMMENTS:
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
    case ReaderTypes.ADD_COMMENT_ANSWER:
      const thisComments2 = state[state.currentId].commentsContent || [];
      if (action.payload.parentId === 0) {
        return <ReaderStateObject>{
          ...state,
          [state.currentId]: {
            ...[state.currentId],
            commentsContent: thisComments2.concat(action.payload.comment),
          },
        };
      } else {
        const commentsIdx = thisComments2
            .findIndex(({id}) => id === action.payload.parentId);
        if (commentsIdx !== -1) {
          console.warn('коментарий с таким айди',
              action.payload.parentId, 'найден:', thisComments2[commentsIdx]);
          const commentsDeepCopy = JSON.parse(JSON.stringify(thisComments2));
          if (!commentsDeepCopy[commentsIdx].answers) {
            commentsDeepCopy[commentsIdx].answers = [];
          }
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

    case ReaderTypes.EDIT_ARTICLE_COMMENT:
      let answerIdx = -1;
      const thisComments = state[state.currentId].commentsContent || [];
      // поиск по комментам нулевого уровня
      let commentsIdx = thisComments
          .findIndex(({id}) => id === action.payload.id);
      if (commentsIdx === -1) {
        // поиск по комментам первого уровня
        commentsIdx = thisComments.findIndex(({answers}, idx) => {
          if (!answers) {
            answers = [];
          }
          answerIdx = answers.findIndex(({id}) => id === action.payload.id);
          if (answerIdx !== -1) {
            commentsIdx = idx;
          }
        });
      }
      // поиск по комментариям 0 уровня или по ответам удался
      if (commentsIdx !== -1) {
        // глубокая копия комментариев к текущей статье
        const commentsDeepCopy =
            JSON.parse(JSON.stringify(state[state.currentId].commentsContent));
        if (answerIdx !== -1) {
          console.warn('коментарий с таким айди',
              action.payload.id, 'найден на 1 уровне:',
              commentsDeepCopy[commentsIdx][answerIdx],
          );
          commentsDeepCopy[commentsIdx][answerIdx].text = action.payload.text;
        } else {
          console.warn('коментарий с таким айди',
              action.payload.id, 'найден на 0 уровне:',
              commentsDeepCopy[commentsIdx],
          );
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

    case CommonTypes.LIKE_CARD:
      if (state[action.payload.id] === undefined) {
        return state;
      }

      const likeArticleCopy = JSON.parse(
          JSON.stringify(state[action.payload.id]),
      );
      if ((likeArticleCopy.liked ^ action.payload.sign) === 0) {
        likeArticleCopy.liked = 0; // отменили оценку
      } else {
        likeArticleCopy.liked = action.payload.sign;
      }
      likeArticleCopy.likes = action.payload.likes;
      return {
        ...state,
        [action.payload.id]: likeArticleCopy,
      };

    case CommonTypes.LIKE_COMMENT: {
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
        if ((changeObj.liked ^ action.payload.sign) === 0) {
          changeObj.liked = 0; // отменили оценку
        } else {
          changeObj.liked = action.payload.sign;
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
    }
  }
  return state;
}
