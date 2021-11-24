export const TYPE = 'TYPE';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
export const authorizationTypes = {
  LOGIN,
  LOGOUT,
};

export const changePageTypes = {
  CHANGE_PAGE: 'CHANGE_PAGE',
  CHANGE_DOC_TITLE: 'CHANGE_DOC_TITLE',
};


export const modalTypes = {
  MODAL_OPEN: 'MODAL_OPEN',
  MODAL_CLOSE: 'MODAL_CLOSE',
};


export const signupFormTypes = {
  SWITCH_FORM_TYPE: 'SWITCH_FORM_TYPE',
};


export const mainPageTypes = {
  ASK_NEW_CARDS: 'ASK_NEW_CARDS',
  SAVE_NEW_CARDS: 'SAVE_NEW_CARDS',
  CLEAR_CARDS: 'CLEAR_CARDS',
  FORBID_CARDS_UPLOADING: 'FORBID_CARDS_UPLOADING',
  ALLOW_CARDS_UPLOADING: 'ALLOW_CARDS_UPLOADING',
  SET_LOADING_FLAG: 'SET_LOADING_FLAG',
  UNSET_LOADING_FLAG: 'UNSET_LOADING_FLAG',
};

export const profilePageTypes = {
  ASK_NEW_USER_ARTICLES: 'ASK_NEW_USER_ARTICLES',
  SAVE_NEW_USER_ARTICLES: 'SAVE_NEW_USER_ARTICLES',
  CLEAR_USER_ARTICLES: 'CLEAR_USER_ARTICLES',
  FORBID_USER_ARTICLES_UPLOADING: 'FORBID_USER_ARTICLES_UPLOADING',
  ALLOW_USER_ARTICLES_UPLOADING: 'ALLOW_USER_ARTICLES_UPLOADING',
  SET_USER_ARTICLES_LOADING: 'SET_USER_ARTICLES_LOADING',
  UNSET_USER_ARTICLES_LOADING: 'UNSET_USER_ARTICLES_LOADING',
  SET_USER_INFO: 'SET_USER_INFO',
  SET_USER_LOADING: 'SET_USER_LOADING',
};

export const categoryPageTypes = {
  ASK_NEW_CATEGORY_ARTICLES: 'ASK_NEW_CATEGORY_ARTICLES',
  SAVE_NEW_CATEGORY_ARTICLES: 'SAVE_NEW_CATEGORY_ARTICLES',
  CLEAR_CATEGORY_ARTICLES: 'CLEAR_CATEGORY_ARTICLES',
  FORBID_CATEGORY_ARTICLES_UPLOADING: 'FORBID_CATEGORY_ARTICLES_UPLOADING',
  ALLOW_CATEGORY_ARTICLES_UPLOADING: 'ALLOW_CATEGORY_ARTICLES_UPLOADING',
  SET_CATEGORY_ARTICLES_LOADING: 'SET_CATEGORY_ARTICLES_LOADING',
  UNSET_CATEGORY_ARTICLES_LOADING: 'UNSET_CATEGORY_ARTICLES_LOADING',
  SELECT_CATEGORY: 'SELECT_CATEGORY',
};

export const searchTypes = {
  ASK_NEW_CARDS: 'ASK_NEW_CARDS_SEARCH',
  SAVE_NEW_CARDS: 'SAVE_NEW_CARDS_SEARCH',
  CLEAR_CARDS: 'CLEAR_CARDS_SEARCH',
  FORBID_CARDS_UPLOADING: 'FORBID_CARDS_UPLOADING_SEARCH',
  ALLOW_CARDS_UPLOADING: 'ALLOW_CARDS_UPLOADING_SEARCH',
  SET_LOADING_FLAG: 'SET_LOADING_FLAG_SEARCH',
  UNSET_LOADING_FLAG: 'UNSET_LOADING_FLAG_SEARCH',
  SET_SEARCH_GROUP: 'SET_SEARCH_GROUP_SEARCH',
  SET_SEARCH_VALUE: 'SET_SEARCH_VALUE_SEARCH',
};

export const apiTypes = {
  SET_UNAVAILABLE: 'SET_UNAVAILABLE',
  SET_AVAILABLE: 'SET_AVAILABLE',
};

export const editorTypes = {
  APPEND_TAG: 'EDITOR_APPEND_TAG',
  REMOVE_TAG: 'EDITOR_REMOVE_TAG',
  EDIT_EXISTING_ARTICLE: 'EDITOR_EDIT_EXISTING_ARTICLE',
  CREATE_ARTICLE: 'EDITOR_CREATE_ARTICLE',
  SAVE_ARTICLE: 'EDITOR_SAVE_ARTICLE',
  PUBLISH_ARTICLE: 'EDITOR_PUBLISH_ARTICLE',
  CLEAR_ARTICLE: 'EDITOR_CLEAR_ARTICLE',
  DELETE_ARTICLE: 'EDITOR_DELETE_ARTICLE',
  SAVE_PREVIEW: 'EDITOR_SAVE_PREVIEW',
  SAVE_CATEGORY: 'EDITOR_SAVE_CATEGORY',
};

export const readerTypes = {
  SAVE_ARTICLE: 'READER_SAVE_ARTICLE',
  OPEN_ARTICLE: 'READER_OPEN_ARTICLE',
  SET_ARTICLE_LOADING: 'READER_SET_ARTICLE_LOADING',
  SAVE_ARTICLE_COMMENTS: 'SAVE_ARTICLE_COMMENTS',
};

export const routerTypes = {
  REDIRECT: 'REDIRECT',
};

export const SYSTYPES = {
  INIT: '__INIT__',
};
