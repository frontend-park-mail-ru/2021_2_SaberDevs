import {authorizationTypes, changePageTypes, mainPageTypes, signupFormTypes, modalTypes} from './types.js'

// TODO: куда-нибудь перенести
const headerLinksOnLogin = [
  {name: 'Профиль', section: 'profilePage', href: '/profile'},
  {section: 'logout', name: 'Выход'},
];
const headerLinksOnLogout = [
  {name: 'Зарегистрироваться', section: 'signupPopUp'},
  {name: 'Войти', section: 'loginPopUp'},
];
const sideBarLinks = ['hello'];

//function themeReducer(state = initialThemeState)


const InitialUserState = {
  login: '',
  name: 'UNAUTHORIZED',
  surname: 'UNAUTHORIZED',
  email: 'UNAUTHORIZED',
  score: 0,
};

export function authorizeReducer(state = InitialUserState, action) {
  if (fluxDebug) {
    console.log('authorizeReducer | prev state: ', state, 'action: ', action)
  }
  switch (action.type) {
    case authorizationTypes.LOGIN:
      return action.payload;
    case authorizationTypes.LOGOUT:
      return InitialUserState;
  }
  return state;
}


const InitialPageState = {
  page: 'main',
  docTitle: 'SaberProject',
};

export function changePageReducer(state = InitialPageState, action) {
  if (fluxDebug) {
    console.log('changePageReducer | prev state: ', state, 'action: ', action)
  }
  switch (action.type) {
    case changePageTypes.CHANGE_PAGE:
      document.title = action.payload.docTitle;
      return {
        ...state,
        page: action.payload.page,
        docTitle: action.payload.docTitle,
      };
    case changePageTypes.CHANGE_DOC_TITLE:
      document.title = action.payload.docTitle;
      return {
        ...state,
        docTitle: action.payload.docTitle,
      };
  }
  return state;
}


const InitialSignupFormState = {showRegister: true};

export function signupFormReducer(state = InitialSignupFormState, action) {
  if (fluxDebug) {
    console.log('signupFormReducer | prev state: ', state, 'action: ', action)
  }
  switch (action.type) {
    case signupFormTypes.SWITCH_FORM_TYPE:
      return {
        ...state,
        showRegister: action.payload,
      };
  }
  return state;
}


const InitialMainPageState = {
  isAuthenticated: false,
  trackedCardId: 'loading-card', // отслеживаемая запись в ленте для подгрузки
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  lastScrollPos: 0,              // скрол для возврата к той же записи
  login: '',                     // для какого пользователя подборка
  cards: [],                     // массив загруженных новостей
  doNotUpload: false,
  headerLinks: headerLinksOnLogout,
  sideBarLinks,
};

export function mainPageReducer(state = InitialMainPageState, action) {
  if (fluxDebug) {
    console.log('mainPageReducer | prev state: ', state, 'action: ', action)
  }
  switch (action.type) {
    case mainPageTypes.SET_LOADING_FLAG:
      return {
        ...state,
        isLoading: true,
      };
    case mainPageTypes.FORBID_CARDS_UPLOADING:
      return {
        ...state,
        doNotUpload: true,
      };
    case mainPageTypes.ALLOW_CARDS_UPLOADING:
      return {
        ...state,
        doNotUpload: false,
      };
    case mainPageTypes.SAVE_NEW_CARDS:
      return {
        ...state,
        isLoading: false,
        idLastLoaded: action.payload.idLastLoaded,
        cards: state.cards.concat(action.payload.cards)
      };
    case mainPageTypes.TOGGLE_AUTH:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        login: action.payload.login,
        headerLinks: action.payload.isAuthenticated ?
          headerLinksOnLogin : headerLinksOnLogout,
      }
    
  }
  return state;
}


const InitialModalState = {};

export function modalReducer(state = InitialModalState, action) {
  if (fluxDebug) {
    console.log('modalReducer | prev state: ', state, 'action: ', action)
  }
  switch (action.type) {
    case modalTypes.MODAL_OPEN:
      return {
        ...state,
      };
    case modalTypes.MODAL_CLOSE:
      return {
        ...state,
      };
  }
  return state;
}


export function combineReducers(reducers) {
  for (let reducer in reducers) {
      if (typeof(reducers[reducer]) !== 'function') {
        console.warn(`Reducers Combiner: ${reducer} is not a function. It will not be called. It is a ${typeof(reducers[reducer])}.`);
        delete reducers[reducer.name];
      }
  } 
  return function(state, action) {
    if (!state) {
      state = {};
    }
    for (let reducer in reducers) {
      const newState = reducers[reducer](state[reducer], action);
      if (newState !== state[reducer]) {
        state[reducer] = newState;
      }
    }
    return state;
  }
}