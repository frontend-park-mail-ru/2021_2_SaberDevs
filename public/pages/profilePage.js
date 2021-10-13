import profileComponent from '../components/profile.pug.js';
import createToMenuBtn from '../components/buttonToMenu.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';

/**
 * импортирует root-элемент через замыкание
 * Страница содержит главный компонент - карточку пользователя
 */
export default function profilePage() {
  const state = store.getState().authorization;
  store.dispatch(changePageActions.changePage('profile', `SaberProject | ${state.login}`));

  root.innerHTML = '';

  const profile = document.createElement('div');
  profile.innerHTML = profileComponent(state);

  const backBtn = createToMenuBtn();

  root.appendChild(profile);
  root.appendChild(backBtn);
}
