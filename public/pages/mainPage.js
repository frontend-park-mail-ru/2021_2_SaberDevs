import headerComponent from '../components/header.js';
import sideBarComponent from '../components/sidebar.js';
// import newsBarComponent from '../components/newsbar.js';
import cardComponent from '../components/card.js';

const testData = [
  {
    previewUrl: 'static/img/computer.png',
    tags: ['IT-News', 'Study'],
    title: '7 Skills of Highly Effective Programmers',
    text: 'Our team was inspired by the seven skills of highly effective' +
    'programmers created by the TechLead. We wanted to provide our own'+
    'take on the topic. Here are our seven skills of effective programmers...',
    authorUrl: '#',
    authorName: 'Григорий',
    authorAvatar: 'static/img/photo-elon-musk.jpg',
    commentsUrl: '#',
    comments: 97,
    likes: 10,
  },
  {
    previewUrl: 'static/img/computer.png',
    tags: ['IT-News', 'Testing'],
    title: 'Article 1',
    text: `hello`,
    authorUrl: '#',
    authorName: 'Tester-1',
    authorAvatar: 'static/img/photo-elon-musk.jpg',
    commentsUrl: '#',
    comments: 1,
    likes: 1002,
  },
  {
    previewUrl: 'static/img/computer.png',
    tags: ['IT-News', 'Testing'],
    title: 'Article 2',
    text: `hello`,
    authorUrl: '#',
    authorName: 'Tester-2',
    authorAvatar: 'static/img/photo-elon-musk.jpg',
    commentsUrl: '#',
    comments: 2,
    likes: 1002,
  },
  {
    previewUrl: 'static/img/computer.png',
    tags: ['IT-News', 'Testing'],
    title: 'Article 3',
    text: `hello`,
    authorUrl: '#',
    authorName: 'Tester-3',
    authorAvatar: 'static/img/photo-elon-musk.jpg',
    commentsUrl: '#',
    comments: 3,
    likes: 1003,
  },
];

/**
 * импортирует root-элемент, через замыкание
 *
 * Страница содержит главный компонент - ленту новостей, хедер, сайдбар.
 * Элементы хедера определяются текущим состоянием.
 * для нее обязательны следующие поля
 *
 * @param {Object} props
 * @property {Array.HTMLAnchorElement} headerLinks
 * @property {Array.HTMLAnchorElement} sideBarLinks
 * @property {boolean} isAuthenticated true - в хедере показывается иконка
 * пользователя, доступен переход в профиль false - ссылки логин/регистрация
 * @property {UserData} userData
 * @property {Array.NewsData} news передается в newsbar для отображения
 * @return {void}
 */
export default function mainPage(props) {
  root.innerHTML = '';
  document.title = 'SaberProject';

  // root.innerHTML = indexComponent();

  let headerContent = '';

  if (props.isAuthenticated) {
    headerContent = userPreviewHeader({url: '/profile/' + props.userData
        .login, name: props.userData.name, img: props.userData.avatar});
  } else {
    // TODO: отдельный шаблон
    const headerNavDIv = document.createElement('div');

    props.headerLinks.map((link) => {
      headerNavDIv.appendChild(link);
    });

    headerContent = headerNavDIv.outerHTML;
  }

  if (headerDebug) {
    console.log('headerContent: ', headerContent);
  }

  root.innerHTML += '<p>test</p>';
  root.innerHTML += headerContent;
  root.innerHTML += '<div id=showScroll></div>';

  root.innerHTML += headerComponent({content: headerContent});
  // TODO: append this components. Решить, нужно ли новости передавать снаружи
  // root.innerHTML += newsBarComponent({content: props.news});

  const mainContainer = document.createElement('main');
  mainContainer.className = 'container';
  mainContainer.innerHTML += sideBarComponent({content: props.sideBarLinks});

  const contentDiv = document.createElement('div');
  contentDiv.className = 'content col';
  testData.forEach((element) => {
    contentDiv.innerHTML += cardComponent(element);
  });

  mainContainer.appendChild(contentDiv);
  root.appendChild(mainContainer);
}
