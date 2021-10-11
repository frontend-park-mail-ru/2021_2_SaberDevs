import {authorizationTypes, changePageTypes, mainPageTypes} from './types.js'

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


const InitialPage = 'main';

export function changePageReducer(state = InitialPage, action) {
  if (fluxDebug) {
    console.log('changePageReducer | prev state: ', state, 'action: ', action)
  }
  switch (action.type) {
    case changePageTypes.CHANGE_PAGE:
      return action.payload;
  }
  return state;
}


const InitialMainPageState = {
  trackedCardId: 'loading-card', // отслеживаемая запись в ленте для подгрузки
  isLoading: false,              // отправлен ли запрос на сервер
  idLastLoaded: '',              // запоминаем последнюю загруженную запись
  lastScrollPos: 0,              // скрол для возврата к той же записи
  login: '',                     // для какого пользователя подборка
  cards: [],                     // массив загруженных новостей
  doNotUpload: false,
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