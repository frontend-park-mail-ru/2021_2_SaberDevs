export type FluxActionType = string;
export interface FluxAction<T = FluxActionType> {
  type: T,
  payload?: any,
};
export type FluxStateObject = {
  [key: string]: any,
};
export type FluxReducer = (state: FluxStateObject, action: FluxAction<string>) => FluxStateObject;
export type FluxStoreCreationFunction = (rootReducer: FluxReducer, initialState: FluxStateObject, ...middlewares: FluxMiddleWare[]) => FluxStore;

export type FluxStore = {
  dispatch: (action: any, props?: any) => void;
  subscribe: (actionType: FluxActionType, callback: (props?: any) => void) => void;
  getState: () => FluxStateObject;
}

// С помощью миддлварей изменияются эти 2 функции
export type FluxEnchancedStore = {
  dispatch: (action: any, props?: any) => void;
  getState: FluxStateObject;
}

export type FluxMiddleWare = (store: FluxEnchancedStore) => (next: FluxMiddleWare) => (action: any) => void;
export type FluxEnchancedStoreCreationFunction = (createStore: FluxStoreCreationFunction) => FluxEnchancedStore;





export enum SYSTYPES {
  INIT = '__INIT__',
}

export enum AuthorizationTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
};

export enum ChangePageTypes {
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_DOC_TITLE = 'CHANGE_DOC_TITLE',
};

export enum ModalTypes {
  MODAL_OPEN = 'MODAL_OPEN',
  MODAL_CLOSE = 'MODAL_CLOSE',
};

export enum SignupFormTypes {
  SWITCH_FORM_TYPE = 'SWITCH_FORM_TYPE',
};

// здесь описаны такие события, на которые
// должны отреагировать несколько компонентов системы
// например, удаление записи
export enum CommonTypes {
  DELETE_CARD = '__DELETE_CARD__',
  LIKE_CARD = '__LIKE_CARD__',
  LIKE_COMMENT = '__LIKE_COMMENT__',
};

export enum MainPageTypes {
  ASK_NEW_CARDS = 'ASK_NEW_CARDS',
  SAVE_NEW_CARDS = 'SAVE_NEW_CARDS',
  CLEAR_CARDS = 'CLEAR_CARDS',
  FORBID_CARDS_UPLOADING = 'FORBID_CARDS_UPLOADING',
  ALLOW_CARDS_UPLOADING = 'ALLOW_CARDS_UPLOADING',
  SET_LOADING_FLAG = 'SET_LOADING_FLAG',
  UNSET_LOADING_FLAG = 'UNSET_LOADING_FLAG',
};

export enum ProfilePageTypes {
  ASK_NEW_USER_ARTICLES = 'ASK_NEW_USER_ARTICLES',
  SAVE_NEW_USER_ARTICLES = 'SAVE_NEW_USER_ARTICLES',
  CLEAR_USER_ARTICLES = 'CLEAR_USER_ARTICLES',
  FORBID_USER_ARTICLES_UPLOADING = 'FORBID_USER_ARTICLES_UPLOADING',
  ALLOW_USER_ARTICLES_UPLOADING = 'ALLOW_USER_ARTICLES_UPLOADING',
  SET_USER_ARTICLES_LOADING = 'SET_USER_ARTICLES_LOADING',
  UNSET_USER_ARTICLES_LOADING = 'UNSET_USER_ARTICLES_LOADING',
  SET_USER_INFO = 'SET_USER_INFO',
  SET_USER_LOADING = 'SET_USER_LOADING',
};

export enum CategoryPageTypes {
  ASK_NEW_CATEGORY_ARTICLES = 'ASK_NEW_CATEGORY_ARTICLES',
  SAVE_NEW_CATEGORY_ARTICLES = 'SAVE_NEW_CATEGORY_ARTICLES',
  CLEAR_CATEGORY_ARTICLES = 'CLEAR_CATEGORY_ARTICLES',
  FORBID_CATEGORY_ARTICLES_UPLOADING = 'FORBID_CATEGORY_ARTICLES_UPLOADING',
  ALLOW_CATEGORY_ARTICLES_UPLOADING = 'ALLOW_CATEGORY_ARTICLES_UPLOADING',
  SET_CATEGORY_ARTICLES_LOADING = 'SET_CATEGORY_ARTICLES_LOADING',
  UNSET_CATEGORY_ARTICLES_LOADING = 'UNSET_CATEGORY_ARTICLES_LOADING',
  SELECT_CATEGORY = 'SELECT_CATEGORY',
};

export enum SearchTypes {
  ASK_NEW_CARDS = 'ASK_NEW_CARDS_SEARCH',
  SAVE_NEW_CARDS = 'SAVE_NEW_CARDS_SEARCH',
  CLEAR_CARDS = 'CLEAR_CARDS_SEARCH',
  FORBID_CARDS_UPLOADING = 'FORBID_CARDS_UPLOADING_SEARCH',
  ALLOW_CARDS_UPLOADING = 'ALLOW_CARDS_UPLOADING_SEARCH',
  SET_LOADING_FLAG = 'SET_LOADING_FLAG_SEARCH',
  UNSET_LOADING_FLAG = 'UNSET_LOADING_FLAG_SEARCH',
  SET_SEARCH_GROUP = 'SET_SEARCH_GROUP_SEARCH',
  SET_SEARCH_VALUE = 'SET_SEARCH_VALUE_SEARCH',

  SHOW_EMPTY_FEED = 'SHOW_EMPTY_FEED_SEARCH',
  SUBMIT_ON_HEADER = 'SUBMIT_ON_HEADER_SEARCH',
  SUBMIT = 'SUBMIT_SEARCH',
  REQUEST = 'REQUEST_SEARCH',
};

export enum StreamTypes {
  ASK_NEW_COMMENTS = 'ASK_NEW_COMMENTS_STREAM',  // UNUSED
  SAVE_NEW_COMMENTS = 'SAVE_NEW_COMMENTS_STREAM',
  CLEAR_COMMENTS = 'CLEAR_COMMENTS_STREAM',
};

export enum ApiTypes {
  SET_UNAVAILABLE = 'SET_UNAVAILABLE',
  SET_AVAILABLE = 'SET_AVAILABLE',
};

export enum EditorTypes {
  APPEND_TAG = 'EDITOR_APPEND_TAG',
  REMOVE_TAG = 'EDITOR_REMOVE_TAG',
  EDIT_EXISTING_ARTICLE = 'EDITOR_EDIT_EXISTING_ARTICLE',
  CREATE_ARTICLE = 'EDITOR_CREATE_ARTICLE',
  PUBLISH_ARTICLE = 'EDITOR_PUBLISH_ARTICLE',
  CLEAR_ARTICLE = 'EDITOR_CLEAR_ARTICLE',
  SAVE_TITLE = 'EDITOR_SAVE_TITLE',
  SAVE_TEXT = 'EDITOR_SAVE_TEXT',
  SAVE_PREVIEW = 'EDITOR_SAVE_PREVIEW',
  SAVE_CATEGORY = 'EDITOR_SAVE_CATEGORY',
};

export enum ReaderTypes {
  SAVE_ARTICLE = 'READER_SAVE_ARTICLE',
  OPEN_ARTICLE = 'READER_OPEN_ARTICLE',
  SET_ARTICLE_LOADING = 'READER_SET_ARTICLE_LOADING',
  SAVE_ARTICLE_COMMENTS = 'READER_SAVE_ARTICLE_COMMENTS',
  EDIT_ARTICLE_COMMENT = 'READER_EDIT_ARTICLE_COMMENT',
  ADD_COMMENT_ANSWER = 'READER_ADD_COMMENT_ANSWER',
  ADD_NEW_COMMENT = 'READER_ADD_NEW_COMMENT',
};

export enum RouterTypes {
  REDIRECT = 'REDIRECT',
};
