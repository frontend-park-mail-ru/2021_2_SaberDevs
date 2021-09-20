import headerComponent from "../components/header.js";
import sideBarComponent from "../components/sidebar.js";
// import newsBarComponent from "../components/newsbar.js";

/**
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар. Элементы хедера определяются текущим состоянием.
 * для нее обязательны следующие поля
 * 
 * импортирует root-элемент, через замыкание
 * 
 * @headerLinks {array[object: HTMLAnchorElement]}
 * @sideBarLinks {array[object: HTMLAnchorElement]}
 * @isAuthenticated {boolean} если true - в хедере показывается иконка пользователя, доступен переход в профиль | false - ссылки логин/регистрация
 * @userData {object: UserData} - требуется, если isAuthenticated === true
 * @news {array[object: NewsData]} передается в блок новостной ленты (newsbar) для отображения 
 * @return void
 */

export default function mainPage(props) {
    root.innerHTML = "";
    document.title = "SaberProject";

    let headerContent = "";
    
    if (props.isAuthenticated) {
        headerContent = userPreviewHeader({url: "/profile/" + props.userData.login, name: props.userData.name, img: props.userData.avatar});
    } else {
        // TODO: отдельный шаблон
        const headerNavDIv = document.createElement("div");

        props.headerLinks.map((link) => {
            headerNavDIv.appendChild(link);
        });
          
        headerContent = headerNavDIv.outerHTML;
    }

    if (headerDebug) {
        console.log("headerContent: ", headerContent);
    }
    root.innerHTML += headerComponent({content: headerContent});
    // TODO: append this components. Решить, нужно ли новости передавать снаружи
    // root.innerHTML += newsBarComponent({content: props.news});
    root.innerHTML += sideBarComponent({content: props.sideBarLinks});
  }