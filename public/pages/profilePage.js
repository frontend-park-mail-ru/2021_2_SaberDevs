import profileComponent from '../components/profile.pug.js';
import createToMenuBtn from '../components/buttonToMenu.js';

import store from '../flux/store.js';
import {changePageActions} from '../flux/actions.js';

/**
 * импортирует root-элемент через замыкание
 *
 *  Страница содержит главный компонент - карточку пользователя
 * для нее обязательны следующие поля
 *
 * @param {UserData} props
 * @return {void}
 */
export default function profilePage() {
  store.dispatch(changePageActions.changePage('profile'));
  const state = store.getState().authorization;

  if (propsDebug) {
    console.log('ProfilePage props: ');
  }

  document.title = 'SaberProject | Profile: ' + state.login;
  root.innerHTML = '';

  const profile = document.createElement('div');
  profile.innerHTML = profileComponent(state);

  const backBtn = createToMenuBtn();

  root.appendChild(profile);
  root.appendChild(backBtn);
}
