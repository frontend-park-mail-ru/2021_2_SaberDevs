import profileComponent from '../components/profile.pug.js';
import createToMenuBtn from '../components/buttonToMenu.js';

/**
 * импортирует root-элемент через замыкание
 *
 *  Страница содержит главный компонент - карточку пользователя
 * для нее обязательны следующие поля
 *
 * @param {UserData} props
 * @return {void}
 */
export default function profilePage(props) {
  if (propsDebug) {
    console.log('ProfilePage props: ', JSON.stringify(props));
  }

  document.title = 'SaberProject | Profile: ' + props.login;
  root.innerHTML = '';

  const profile = document.createElement('div');
  profile.innerHTML = profileComponent(props);

  const backBtn = createToMenuBtn();

  root.appendChild(profile);
  root.appendChild(backBtn);
}
