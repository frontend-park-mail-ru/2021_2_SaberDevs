import profileComponent from "../components/profile.js"
import createToMenuBtn from "../components/buttonToMenu.js"

/**
 * Страница содержит главный компонент - карточку пользователя
 * для нее обязательны следующие поля
 * 
 * импортирует root-элемент через замыкание
 * 
 * @name {string}
 * @surname {string}
 * @login {string}
 * @email {string}
 * @return void
 */

export default function profilePage(props) {
    if (propsDebug) console.log("ProfilePage props: ", JSON.stringify(props));

    document.title = "SaberProject | Profile: " + props.login;
    root.innerHTML = "";

    const profile = document.createElement("div");
    profile.innerHTML = profileComponent(props);

    const backBtn = createToMenuBtn();
    
    root.appendChild(profile);
    root.appendChild(backBtn);
}
