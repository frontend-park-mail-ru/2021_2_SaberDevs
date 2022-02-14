type likeRate = 1;
type dislikeRate = -1;
type defaultRate = 0;

export type Rate = likeRate | dislikeRate | defaultRate;
export type RateToSrvr = likeRate | dislikeRate;

class RatesC {
  like: likeRate;
  dislike: dislikeRate;
  default: defaultRate;
}
export const Rates = new RatesC();

/**
 * @typedef {Object} Comment
 * @property {string} text
 * @property {number} articleId
 * @property {number} id
 * @property {number} parentId
 * @property {string} dateTime
 * @property {boolean} isEdited
 * @property {User} author
 * @property {number} likes
 * @property {boolean} liked
 */

export type Comment = {
  text: string,
  articleId: number,
  parentId: number,
  id: number,
  datetime: string,
  datetimeMS: number,
  isEdited: boolean,
  author: User,
  likes: number,
  liked: Rate,
};

export interface CommentWithAnswers extends Comment {
  answers: Comment[];
}

type GetCommentApi = {
  text: string;
  articleId: string; // TODO: number
  parentId: string; // TODO: number
  id: string; // TODO: number
  dateTime: string;
  isEdited: boolean;
  author: User;
  likes: number;
}

export type ArticleId = number | '' | 'end';

/**
 * @typedef {Object} Article
 * @property {number} id
 * @property {string} title
 * @property {string} text
 * @property {string} previewUrl
 * @property {string} category
 * @property {User} author
 * @property {string} dateTime
 * @property {number} likes
 * @property {boolean} liked
 * @property {Array<string>} tags
 * @property {Array<CommentWithAnswers}>} commentsContent
 */

export type Article = {
  id: ArticleId,
  previewUrl: string,
  title: string,
  text: string,
  category: string,
  author: User,
  datetime: string
  comments: number,
  likes: number,
  liked: Rate,
  tags: string[],
  commentsContent: CommentWithAnswers[],
};

export type User = {
  login: string,
  avatarUrl: string,
  firstName?: string,
  lastName?: string,
  score?: number,
  description?: string,
};
